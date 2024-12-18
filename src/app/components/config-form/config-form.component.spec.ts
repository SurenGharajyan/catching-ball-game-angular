import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigFormComponent } from './config-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {GameConfiguration} from "../../common/types/@interfaces/game-configuration";

describe('ConfigFormComponent', () => {
  let component: ConfigFormComponent;
  let fixture: ComponentFixture<ConfigFormComponent>;
  let gameServiceMock: jasmine.SpyObj<GameService>;

  beforeEach(async () => {
    gameServiceMock = jasmine.createSpyObj('GameService', ['updateConfig']);

    gameServiceMock.updateConfig.and.returnValue(of(null) as any);

    await TestBed.configureTestingModule({
      declarations: [ ConfigFormComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        FormBuilder,
        { provide: GameService, useValue: gameServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValues = component.gameConfigForm.value;

    expect(formValues.fallingSpeed).toBe(100);
    expect(formValues.fallingFrequency).toBe(600);
    expect(formValues.playerSpeed).toBe(25);
    expect(formValues.gameTime).toBe(50000);
  });

  it('should call updateConfig when form values change', () => {
    const formValue: GameConfiguration = {
      fallingSpeed: 120,
      fallingFrequency: 650,
      playerSpeed: 30,
      gameTime: 60000
    };

    component.gameConfigForm.setValue(formValue);

    expect(gameServiceMock.updateConfig).toHaveBeenCalledWith({
      fallingSpeed: 120,
      fallingFrequency: 650,
      playerSpeed: 30,
      gameTime: 60000
    });
  });

  it('should call updateConfig with initial form values in ngOnInit', () => {
    expect(gameServiceMock.updateConfig).toHaveBeenCalledWith(component.gameConfigForm.getRawValue());
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = spyOn(component['$destroy'], 'next');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should call updateConfig when valueChanges is emitted', () => {
    const formValue: GameConfiguration = {
      fallingSpeed: 150,
      fallingFrequency: 700,
      playerSpeed: 35,
      gameTime: 70000
    };


    component.gameConfigForm.setValue(formValue);


    expect(gameServiceMock.updateConfig).toHaveBeenCalledWith({
      fallingSpeed: 150,
      fallingFrequency: 700,
      playerSpeed: 35,
      gameTime: 70000
    });
  });
});
