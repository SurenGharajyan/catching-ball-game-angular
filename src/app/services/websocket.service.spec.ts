import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { WebSocketData } from '../common/types/@interfaces/websocket-data';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send game state updates correctly', () => {
    const spy = spyOn(service['gameStateUpdateSubject'], 'next');
    const mockData: WebSocketData = { caughtObjects: 10, timeRemaining: 5000 };

    service.sendGameStateUpdate(mockData);

    expect(spy).toHaveBeenCalledWith(mockData);
  });

  it('should emit game state updates via gameStateUpdate$', (done) => {
    const mockData: WebSocketData = { caughtObjects: 5, timeRemaining: 3000 };

    service.gameStateUpdate$.subscribe((data: any) => {
      expect(data).toEqual(mockData);
      done();
    });

    // Send a game state update
    service.sendGameStateUpdate(mockData);
  });

  it('should complete the gameStateUpdate$ observable when stopGameStateUpdates is called', (done) => {
    service.gameStateUpdate$.subscribe({
      complete: () => {
        done();
      },
    });

    // Call stopGameStateUpdates to complete the observable
    service.stopGameStateUpdates();
  });
});
