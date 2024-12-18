import { GameService } from '../../services/game.service';
import { MechanicService } from '../../services/mechanic.service';
import { removeFocusFromInputs } from '../../common/utils/helper';
import { Position } from '../../common/types/@interfaces/position';
import { WebSocketService } from '../../services/websocket.service';
import { interval, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { PlayerMovement } from '../../common/types/@interfaces/player-movement';
import { GameConfiguration } from '../../common/types/@interfaces/game-configuration';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-game-play-modal',
  templateUrl: './game-play-modal.component.html',
})
export class GamePlayModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contentWrapper', { static: false })
  public gameContentWrapper!: ElementRef<HTMLDivElement>;

  @ViewChild('player', { static: false })
  public player!: ElementRef<HTMLImageElement>;

  public fallingBalls: Position[] = [];
  public currentScore: number = 0;
  public isGameInProgress = true;

  public gameConfig!: GameConfiguration;

  private initialGameTime!: number | null;
  private timerSubscription = new Subscription();
  private ballDataSubscription = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(
    private gameService: GameService,
    private mechanicService: MechanicService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.gameService.restartGameObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRestarting: boolean) => {
        this.restartGame(isRestarting);
      });
  }

  @HostListener('window:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      removeFocusFromInputs();
      this.mechanicService.movePlayerLeft(this.gameConfig.playerSpeed);
    } else if (event.key === 'ArrowRight') {
      removeFocusFromInputs();
      this.mechanicService.movePlayerRight(
        this.player.nativeElement.offsetWidth,
        this.gameContentWrapper.nativeElement.offsetWidth,
        this.gameConfig.playerSpeed
      );
    }
  }

  public ngAfterViewInit(): void {
    this.startGame();
  }

  public getPlayerMovement(): PlayerMovement {
    return this.mechanicService.playerMovement;
  }

  private startGame(): void {
    this.isGameInProgress = false;
    this.initialGameTime = null;
    this.initializeGameConfig();
    this.startGameTimer();
    this.mechanicService.playerMovement = { direction: 1, x: this.gameContentWrapper.nativeElement.offsetWidth / 2 };
    this.cdr.detectChanges();
    this.mechanicService.player = this.player.nativeElement;
  }

  private restartGame(isRestarting: boolean): void {
    this.fallingBalls = [];
    this.mechanicService.stopGame();
    this.currentScore = 0;
    this.isGameInProgress = true;

    if (isRestarting) {
      this.initialGameTime = null;
      this.updateGameConfig(this.gameService.configuration);
      this.triggerBallGeneration();
    }

    this.startGameTimer();
    this.mechanicService.playerMovement = { direction: 1, x: this.gameContentWrapper.nativeElement.offsetWidth / 2 };
    this.cdr.detectChanges();
    this.mechanicService.player = this.player.nativeElement;
  }

  private initializeGameConfig(): void {
    this.gameService.updateConfigObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe((configuration: GameConfiguration) => {
        this.updateGameConfig(configuration);
        if (!this.isGameInProgress) {
          this.addBallLogic();
        }
        this.isGameInProgress = true;
      });
  }

  private startGameTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          if (this.gameConfig.gameTime <= 0) {
            this.timerSubscription.unsubscribe();
            this.isGameInProgress = false;
            this.webSocketService.stopGameStateUpdates();
            if (this.ballDataSubscription) {
              this.ballDataSubscription.unsubscribe();
            }
          } else {
            this.gameConfig.gameTime--;
            this.webSocketService.sendGameStateUpdate({
              caughtObjects: this.currentScore,
              timeRemaining: this.gameConfig.gameTime
            });
          }
        })
      )
      .subscribe();
  }

  public handleRetry(): void {
    this.gameService.restartGame(true);
  }

  private updateGameConfig(configuration: GameConfiguration): void {
    const previousGameTime = this.gameConfig?.gameTime;
    this.gameConfig = { ...configuration };
    if (!this.initialGameTime) {
      this.initialGameTime = configuration.gameTime;
      this.gameConfig.gameTime /= 1000;
    } else if (this.initialGameTime !== configuration.gameTime) {
      if (this.isGameInProgress) {
        this.initialGameTime = configuration.gameTime;
        this.gameService.restartGame();
        this.gameConfig.gameTime /= 1000;
      } else {
        this.handleRetry();
      }
    } else {
      this.gameConfig.gameTime = previousGameTime;
    }
  }

  private addBallLogic(): void {
    const gameSpace = this.gameContentWrapper.nativeElement;
    this.mechanicService.startFallingBalls(
      {
        x: gameSpace.offsetWidth - 30,
        y: gameSpace.offsetHeight
      },
      this.gameConfig,
      this.destroy$
    );
    this.triggerBallGeneration();
  }

  private triggerBallGeneration(): void {
    this.ballDataSubscription = this.mechanicService.fallingBallsData$
      .pipe(
        takeUntil(this.destroy$),
        tap((ballInfo): void => {
          this.fallingBalls = ballInfo.balls;
          if (ballInfo.countingScore && ballInfo.countingScore > 0) {
            this.currentScore += ballInfo.countingScore;
            this.webSocketService.sendGameStateUpdate({
              caughtObjects: this.currentScore,
              timeRemaining: this.gameConfig.gameTime
            });
          }
        })
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription.unsubscribe();
  }
}
