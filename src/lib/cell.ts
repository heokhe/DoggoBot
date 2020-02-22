import { Action, Direction } from './action';
import { Coordinates } from './table';

export class Cell {
  north = new Action(Direction.North);

  east = new Action(Direction.East);

  south = new Action(Direction.South);

  west = new Action(Direction.West);

  coordinates: Coordinates;

  active = false;

  constant = false;

  constructor(coordinates: Coordinates) {
    this.coordinates = coordinates;
  }

  get actions() {
    return [this.north, this.east, this.west, this.south];
  }

  get mostValuableAction() {
    return this.actions.sort((a, b) => b.value - a.value)[0];
  }

  getAction(direction: Direction) {
    return this.actions.find(action => action.direction === direction);
  }

  setAction(direction: Direction, value: number) {
    if (!this.constant) {
      this.getAction(direction).value = value;
    }
  }

  set(value: number) {
    this.setAction(Direction.North, value);
    this.setAction(Direction.East, value);
    this.setAction(Direction.South, value);
    this.setAction(Direction.West, value);
  }
}
