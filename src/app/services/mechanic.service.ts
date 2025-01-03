import { Injectable } from '@angular/core';
import { GameService } from "./game.service";
import { Position } from "../common/types/@interfaces/position";
import { PlayerMovement } from "../common/types/@interfaces/player-movement";
import { checkCollision, randomIntFromInterval } from "../common/utils/helper";
import { GameConfiguration } from "../common/types/@interfaces/game-configuration";
import { interval, Observable, ReplaySubject, Subject, Subscription, switchMap, takeUntil } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MechanicService {

  private _fallingBalls: Position[] = [];
  private ballSubject = new ReplaySubject<{ balls: Position[], countingScore?: number }>(1);
  private ballDataObservable = this.ballSubject.asObservable();

  private _playerMovement!: PlayerMovement;
  private _player!: HTMLImageElement;
  private currentFallingSpeed: number = 0;
  private fallingFrequency: number = 0;
  private fallingSubscription!: Subscription;
  private animationFrameId: number | null = null;

  constructor(
    private gameService: GameService
  ) {}

  public get fallingBalls(): Position[] {
    return this._fallingBalls;
  }

  public get fallingBallsData$(): Observable<{ balls: Position[], countingScore?: number }> {
    return this.ballDataObservable;
  }

  public get playerMovement(): PlayerMovement {
    return this._playerMovement;
  }

  public set playerMovement(value: PlayerMovement) {
    this._playerMovement = value;
  }

  public set player(value: HTMLImageElement) {
    this._player = value;
  }

  public startFallingBalls(
    maxPositions: Position,
    gameConfig: GameConfiguration,
    $interrupt: Subject<any>
  ): void {
    this.currentFallingSpeed = gameConfig.fallingSpeed;
    this.fallingFrequency = gameConfig.fallingFrequency;

    this.gameService.updateConfigObservable
      .pipe(
        takeUntil($interrupt),
        switchMap((updatedConfig: GameConfiguration) => {
          this.currentFallingSpeed = updatedConfig.fallingSpeed;
          this.fallingFrequency = updatedConfig.fallingFrequency;

          if (this.fallingSubscription) {
            this.fallingSubscription.unsubscribe();
          }

          return interval(this.fallingFrequency).pipe(takeUntil($interrupt));
        })
      )
      .subscribe(() => {
        this.spawnNewBall(maxPositions.x);
      });

    if (!this.animationFrameId) {
      this.animateFallingBalls(maxPositions.y);
    }
  }

  private animateFallingBalls(bottomY: number): void {
    const step = (): void => {
      this._fallingBalls = this._fallingBalls.map((ball: Position) => ({
        ...ball,
        y: ball.y + this.currentFallingSpeed / 60,
      }));

      let scoreFromCollapsedBalls = 0;

      this._fallingBalls = this._fallingBalls.filter((ball: Position) => ball.y <= bottomY);

      scoreFromCollapsedBalls = this.checkForCollisions();

      this.ballSubject.next({
        balls: [...this._fallingBalls],
        countingScore: scoreFromCollapsedBalls > 0 ? scoreFromCollapsedBalls : undefined,
      });

      this.animationFrameId = requestAnimationFrame(step);
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  public stopGame(): void {
    this._fallingBalls = [];
  }

  private spawnNewBall(maxX: number): void {
    const newBallPosition: Position = {
      x: randomIntFromInterval(0, maxX),
      y: 0
    };
    this._fallingBalls.push(newBallPosition);
    this.ballSubject.next({ balls: [...this._fallingBalls] });
  }

  public movePlayerLeft(speed: number): void {
    const direction = -1;
    const newXPosition = this._playerMovement.x + (speed * direction);
    this._playerMovement = { direction, x: Math.max(0, newXPosition) };
  }

  public movePlayerRight(playerWidth: number, maxPosX: number, speed: number): void {
    const newXPosition = this._playerMovement.x + speed;
    this._playerMovement = { direction: 1, x: Math.min(maxPosX - playerWidth, newXPosition) };
  }

  private checkForCollisions(): number {
    let collapsedBallsCount = 0;

    this._fallingBalls = this._fallingBalls.filter((ball: Position) => {
      const hasCollapsed = checkCollision(
        { x: ball.x, y: ball.y },
        { x: this._playerMovement.x, y: this._player.y },
        this._player.offsetWidth,
        60
      );

      if (hasCollapsed) {
        collapsedBallsCount++;
      }

      return !hasCollapsed;
    });

    return collapsedBallsCount;
  }
}
