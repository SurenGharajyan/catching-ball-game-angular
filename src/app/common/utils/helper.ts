import {Position} from "../types/@interfaces/position";

export const checkCollision = (
  ballPosition: Position,
  playerPosition: Position,
  playerWidth: number,
  ballSize: number
): boolean => {
  const defaultTopPosition = 87;
  const vertCollapse =
    ballPosition.y + defaultTopPosition + ballSize >= playerPosition.y &&
    ballPosition.y <= playerPosition.y;
  const horizCollapse =
    ballPosition.x + ballSize >= playerPosition.x &&
    ballPosition.x - playerWidth <= playerPosition.x;
  return vertCollapse && horizCollapse
}

export const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const removeFocusFromInputs = (): void => {
  const inputs = document.querySelectorAll('input, textarea, select') as NodeListOf<HTMLElement>;

  inputs.forEach(input => {
    input.blur();
  });
}
