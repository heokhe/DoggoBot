import { Action, ActionDirection } from './action';
import { Coordinates } from './table';

export class Cell {
  north = new Action(ActionDirection.North);

  east = new Action(ActionDirection.East);

  south = new Action(ActionDirection.South);

  west = new Action(ActionDirection.West);

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

  getAction(direction: ActionDirection) {
    return this.actions.find(action => action.direction === direction);
  }

  setAction(direction: ActionDirection, value: number) {
    if (!this.constant) {
      this.getAction(direction).value = value;
    }
  }

  set(value: number) {
    this.setAction(ActionDirection.North, value);
    this.setAction(ActionDirection.East, value);
    this.setAction(ActionDirection.South, value);
    this.setAction(ActionDirection.West, value);
  }
}
