import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigFormComponent } from "./components/config-form/config-form.component";
import { GamePlayModalComponent } from "./components/game-modal/game-play-modal.component";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        GamePlayModalComponent,
        ConfigFormComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-game-play-modal component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const gamePlayModalElement = compiled.querySelector('app-game-play-modal');
    expect(gamePlayModalElement).toBeTruthy();
  });

  it('should render app-config-form component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const configFormElement = compiled.querySelector('app-config-form');
    expect(configFormElement).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toBe('catching-balls-game-angular');
  });
});
