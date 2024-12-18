import { Subject } from 'rxjs';
import { GameService } from './game.service';
import { TestBed } from '@angular/core/testing';
import { MechanicService } from './mechanic.service';
import { Position } from '../common/types/@interfaces/position';
import { PlayerMovement } from '../common/types/@interfaces/player-movement';

describe('MechanicService', () => {
  let service: MechanicService;
  let gameServiceMock: jasmine.SpyObj<GameService>;
  let interrupt$: Subject<any>;

  beforeEach(() => {
    gameServiceMock = jasmine.createSpyObj('GameService', ['updateConfigObservable']);
    interrupt$ = new Subject<any>();

    TestBed.configureTestingModule({
      providers: [
        MechanicService,
        { provide: GameService, useValue: gameServiceMock }
      ]
    });
    service = TestBed.inject(MechanicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should move player left', () => {
    const initialPlayerMovement: PlayerMovement = { direction: 1, x: 100 };
    service.playerMovement = initialPlayerMovement;
    const speed = 10;

    service.movePlayerLeft(speed);

    expect(service.playerMovement.x).toBe(90); // 100 - 10 = 90
    expect(service.playerMovement.direction).toBe(-1);
  });

  it('should move player right', () => {
    const initialPlayerMovement: PlayerMovement = { direction: -1, x: 50 };
    service.playerMovement = initialPlayerMovement;
    const playerWidth = 30;
    const maxPosX = 500;
    const speed = 20;

    service.movePlayerRight(playerWidth, maxPosX, speed);

    expect(service.playerMovement.x).toBe(70); // 50 + 20 = 70
    expect(service.playerMovement.direction).toBe(1);
  });

  it('should stop the game and clear falling balls', () => {
    service.stopGame();

    expect(service['fallingBalls'].length).toBe(0);
  });

  it('should spawn new ball', () => {
    const maxX = 500;
    const initialBallCount = service['fallingBalls'].length;

    (service as any).spawnNewBall(maxX);

    // Check that a new ball has been added to the fallingBalls array
    expect(service['fallingBalls'].length).toBeGreaterThan(initialBallCount);
  });

  it('should check for collisions and return count of collapsed balls', () => {
    const mockPlayerMovement: PlayerMovement = { direction: 1, x: 100 };
    service['_playerMovement'] = mockPlayerMovement;
    (service as any)['_player'] = { offsetHeight: 30, offsetWidth: 30, y: 100, x: 100 };

    const ball: Position = { x: 100, y: 100 };
    service['fallingBalls'] = [ball];

    const collisionCount = service['checkForCollisions']();

    expect(collisionCount).toBe(1);
    expect(service['fallingBalls'].length).toBe(0);
  });
});
