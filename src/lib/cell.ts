import { Action, Direction, DirectionName } from './action';
import { Coordinates } from './helpers';

export class Cell {
  coordinates: Coordinates;

  active = false;

  actions: Action[];

  constructor(coordinates: Coordinates, directions: {
    [x in DirectionName]: boolean;
  }) {
    this.coordinates = coordinates;
    this.actions = Object.entries(directions)
      .filter(([, value]) => value)
      .map(([name]) => new Action(Direction[name as DirectionName]));
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
    return lessValueableActions[Math.floor(r * lessValueableActions.length)];
  }
}
