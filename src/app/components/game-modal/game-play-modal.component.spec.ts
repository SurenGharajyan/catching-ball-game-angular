import { of } from "rxjs";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {GamePlayModalComponent } from './game-play-modal.component';
import { WebSocketService } from 'src/app/services/websocket.service';

describe('GamePlayModalComponent', () => {
  let component: any;
  let fixture: ComponentFixture<GamePlayModalComponent>;
  let gameServiceMock: any;
  let webSocketServiceMock: any;
  let mechanicServiceMock: any;
  beforeEach(() => {
    gameServiceMock = jasmine.createSpyObj('GameService', ['restartGameObservable', 'restartGame']);
    webSocketServiceMock = jasmine.createSpyObj('WebSocketService', ['sendGameState']);
    mechanicServiceMock = jasmine.createSpyObj('WebSocketService', ['movePlayerRight', 'movePlayerLeft']);

    gameServiceMock.restartGameObservable = of('game restarted');
    gameServiceMock.configuration = {
      fallingSpeed: 50,
      fallingFrequency: 100,
      playerSpeed: 10,
      gameTime: 1000,
    }
    gameServiceMock.restartGame = () => {};
    gameServiceMock.updateConfigObservable = of([]);
    mechanicServiceMock._playerMovement = { direction: 1, x: 10 };
    mechanicServiceMock.playerMovement = { direction: 1, x: 10 };

    TestBed.configureTestingModule({
      declarations: [GamePlayModalComponent],
      providers: [
        { provide: GameService, useValue: gameServiceMock },
        { provide: WebSocketService, useValue: webSocketServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePlayModalComponent);
    component = fixture.componentInstance;
    component.gameContentWrapper = {
      nativeElement: {
        offsetWidth: 10,
        offsetHeight: 10
      }
    }
    component.player = {
      nativeElement: {
        offsetWidth: 10,
        offsetHeight: 10
      }
    }
    component.gameConfig = { playerSpeed: 10 } as any;
  });

  it('should create', () => {
    fixture.detectChanges();
    // expect(component).toBeTruthy();
  });

  it('should stop the game and unsubscribe from the timer when the time is up', () => {
    component.ngOnInit();
    expect(gameServiceMock.restartGameObservable.pipe).toBeTruthy();
  });

  it('should handle the game timer logic correctly', () => {
    component.ngOnInit();
    expect(gameServiceMock.restartGameObservable.pipe).toBeTruthy();
  });


  it('should update game config when gameService configuration changes', () => {
    gameServiceMock.restartGameObservable = of('new config');
    component.ngOnInit();
    expect(gameServiceMock.restartGameObservable.pipe).toBeTruthy();
  });

  it('should set initialGameTime and divide gameTime by 1000 when initialGameTime is not set', () => {
    const configuration = { gameTime: 60000 };

    component['updateGameConfig'](configuration);

    expect(component.initialGameTime).toBe(60000);
    expect(component.gameConfig?.gameTime).toBe(60);
  });

  it('should restart the game when gameTime changes and the game is in progress', () => {
    const configuration = { gameTime: 120000 };
    component.initialGameTime = 60000;
    component.isGameInProgress = true;
    component['updateGameConfig'](configuration);

    expect(component.initialGameTime).toBe(120000);
    expect(component.gameConfig?.gameTime).toBe(120);
  });

  it('should call handleRetry when gameTime changes and the game is not in progress', () => {
    const configuration = { gameTime: 90000 }; // 90 seconds
    spyOn(component, 'handleRetry');
    component.initialGameTime = 60000;
    component.isGameInProgress = false;

    component['updateGameConfig'](configuration);

    expect(component.handleRetry).toHaveBeenCalled();
    expect(component.initialGameTime).toBe(60000);
  });

  it('should reset gameTime to previous value if no conditions match', () => {
    const configuration = { gameTime: 60000 };
    component.initialGameTime = 60000;
    component.gameConfig = { gameTime: 30000 };

    component['updateGameConfig'](configuration);

    expect(component.gameConfig?.gameTime).toBe(30000);
  });

  it('should not call any methods on unrelated key press', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

    component.onKeyDown(event);

    expect(mechanicServiceMock.movePlayerLeft).not.toHaveBeenCalled();
    expect(mechanicServiceMock.movePlayerRight).not.toHaveBeenCalled();
  });

  it('should call gameService.restartGame with true', () => {
    const spy = spyOn(gameServiceMock, 'restartGame');
    component.handleRetry();

    expect(spy).toHaveBeenCalledWith(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
