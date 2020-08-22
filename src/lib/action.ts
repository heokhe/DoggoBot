export const enum Direction {
  North = 1,
  East,
  South,
  West
}

export class Action {
  direction: Direction;

  value: number;

  constructor(direction: Direction) {
    this.direction = direction;
    this.value = 0;
  }
}
