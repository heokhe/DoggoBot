import { ActionDirection } from './lib/action';

export function getActionFromEventObject(event: KeyboardEvent): ActionDirection {
  return {
    ArrowUp: ActionDirection.North,
    ArrowDown: ActionDirection.South,
    ArrowRight: ActionDirection.East,
    ArrowLeft: ActionDirection.West
  }[event.code];
}
