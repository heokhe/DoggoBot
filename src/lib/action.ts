export enum Direction {
  North = 1,
  East,
  South,
  West
}
export type DirectionName = (keyof typeof Direction) & string;

export class Action {
  direction: Direction;

  value: number;

  constructor(direction: Direction) {
    this.direction = direction;
    this.value = 0;
  }
}
