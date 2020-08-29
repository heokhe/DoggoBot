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

  get mostValuableAction(): Action {
    let mostValuableAction: Action;
    for (const action of this.actions)
      if (!mostValuableAction || action.value > mostValuableAction.value)
        mostValuableAction = action;
    const equalActions = this.actions.filter(a => a.value === mostValuableAction.value);
    const index = Math.floor(Math.random() * equalActions.length);
    return equalActions[index];
  }

  getAction(direction: Direction) {
    return this.actions.find(action => action.direction === direction);
  }

  setAction(direction: Direction, value: number) {
    if (!this.constant) {
      this.getAction(direction).value = value;
    }
  }

  decide(randomness: number): Action {
    const { mostValuableAction, actions } = this,
      lessValueableActions = actions.filter(a => a !== mostValuableAction),
      r = Math.random();
    if (r > randomness) {
      return mostValuableAction;
    }
    // TODO: handle corners
    return lessValueableActions[Math.floor(r * 3)];
  }

  set(value: number) {
    this.setAction(Direction.North, value);
    this.setAction(Direction.East, value);
    this.setAction(Direction.South, value);
    this.setAction(Direction.West, value);
  }
}
