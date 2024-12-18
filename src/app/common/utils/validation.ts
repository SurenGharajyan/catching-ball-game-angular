export const validateNumericInput = (event: KeyboardEvent) => {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
  const inputElement = event.target as HTMLInputElement;
  const key = event.key;

  if (/^\d$/.test(key) || allowedKeys.includes(key)) {
    return;
  }

  event.preventDefault();

  if ((key === 'Backspace' || key === 'Delete') && inputElement.value.length === 1) {
    event.preventDefault();
  }
};

export const validateMinValue = (
  event: Event,
  minValue: number,
  formControl: any
): void => {
  const inputElement = event.target as HTMLInputElement;
  const currentValue = Number(inputElement.value);

  if (currentValue < minValue || isNaN(currentValue)) {
    formControl.setValue(minValue, { emitEvent: true });
  }
};
