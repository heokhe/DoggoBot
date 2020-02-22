import { Direction } from './lib/action';

export function getActionFromEventObject(event: KeyboardEvent): Direction {
  return {
    ArrowUp: Direction.North,
    ArrowDown: Direction.South,
    ArrowRight: Direction.East,
    ArrowLeft: Direction.West
  }[event.code];
}

export function createColor(value: number) {
  const hue = value > 0 ? 100 : 12,
    saturation = Math.abs(value) * 100;
  return `hsl(${hue}, ${saturation}%, 40%)`;
}
