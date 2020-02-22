import { Direction } from './lib/action';

export function getActionFromEventObject(event: KeyboardEvent): Direction {
  return {
    ArrowUp: Direction.North,
    ArrowDown: Direction.South,
    ArrowRight: Direction.East,
    ArrowLeft: Direction.West
  }[event.code];
}
