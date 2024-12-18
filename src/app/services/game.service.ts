import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { GameConfiguration } from '../common/types/@interfaces/game-configuration';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private currentConfiguration!: GameConfiguration;
  private updateConfigSubject = new BehaviorSubject<GameConfiguration>(this.currentConfiguration);
  private restartGameSubject = new Subject<boolean>();

  constructor() { }

  public get configuration(): GameConfiguration {
    return this.currentConfiguration;
  }

  public get updateConfigObservable(): Observable<GameConfiguration> {
    return this.updateConfigSubject.asObservable();
  }

  public get restartGameObservable(): Observable<boolean> {
    return this.restartGameSubject.asObservable();
  }

  /**
   * Updates the game configuration and emits the new value.
   * @param newConfig - The updated game configuration.
   */
  public updateConfig(newConfig: GameConfiguration): void {
    if (this.currentConfiguration !== newConfig) {
      this.currentConfiguration = newConfig;
      this.updateConfigSubject.next(newConfig);
    }
  }

  /**
   * Triggers the restart of the game by emitting the restart signal.
   * @param dispatching - Flag to control whether to trigger the restart signal or not.
   */
  public restartGame(dispatching: boolean = false): void {
    this.restartGameSubject.next(dispatching);
  }
}
