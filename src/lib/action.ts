export enum ActionDirection {
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
  direction: ActionDirection;

  value: number;

  constructor(direction: ActionDirection) {
    this.direction = direction;
    this.value = 0;
  }
}
