export enum Direction {
  North = 1,
  East,
  South,
  West
}

// How about:
// export enum Direction3D {
//   North,
//   East,
//   South,
//   West,
//   Front,
//   Back
// }

export class Action {
  direction: Direction;

  value: number;

  constructor(direction: Direction) {
    this.direction = direction;
    this.value = 0;
  }
}
