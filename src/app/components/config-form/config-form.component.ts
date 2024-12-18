import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameService } from '../../services/game.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameConfiguration } from '../../common/types/@interfaces/game-configuration';
import { validateNumericInput, validateMinValue } from '../../common/utils/validation';

@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
})
export class ConfigFormComponent implements OnInit, OnDestroy {
  public gameConfigForm!: FormGroup;

  protected readonly validateMinValue = validateMinValue;
  protected readonly validateNumericInput = validateNumericInput;

  private $destroy = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private gameService: GameService
  ) {}

  public ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
    this.setInitialFormValues();
  }

  private initializeForm(): void {
    this.gameConfigForm = this.formBuilder.group({
      fallingSpeed: [100, [Validators.required, Validators.min(1)]],
      fallingFrequency: [600, [Validators.required, Validators.min(500)]],
      playerSpeed: [25, [Validators.required, Validators.min(1)]],
      gameTime: [50000, [Validators.required, Validators.min(10000)]]
    });
  }

  private subscribeToFormChanges(): void {
    this.gameConfigForm.valueChanges
      .pipe(takeUntil(this.$destroy)) // Ensure unsubscription
      .subscribe((value: GameConfiguration) => {
        this.gameService.updateConfig({
          fallingSpeed: +value.fallingSpeed,
          fallingFrequency: +value.fallingFrequency,
          playerSpeed: +value.playerSpeed,
          gameTime: +value.gameTime
        });
      });
  }

  private setInitialFormValues(): void {
    this.gameService.updateConfig(this.gameConfigForm.getRawValue());
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

}
