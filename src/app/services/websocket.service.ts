import { Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import {WebSocketData} from "../common/types/@interfaces/websocket-data";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private gameStateUpdateSubject = new Subject<{ caughtObjects: number, timeRemaining: number }>();
  public gameStateUpdate$ = this.gameStateUpdateSubject.asObservable();

  constructor() { }

  // Imitation of Websocket data sending
  public sendGameStateUpdate(sendData: WebSocketData): void {
    console.info('Sending By Websocket', 'caughtObjects: ' + sendData.caughtObjects, 'timeRemaining: ' + sendData.timeRemaining)
    this.gameStateUpdateSubject.next(sendData);
  }

  // Cancel the sending data function
  public stopGameStateUpdates(): void {
    this.gameStateUpdateSubject.complete();
  }
}
