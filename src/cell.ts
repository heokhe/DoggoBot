import { Action, ActionDirection } from './action'
import { Coordinates } from './coordinates';

export class Cell {
  north = new Action(ActionDirection.North);
  east = new Action(ActionDirection.East);
  south = new Action(ActionDirection.South);
  west = new Action(ActionDirection.West);
  coordinates: Coordinates;
  active = false;

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
}