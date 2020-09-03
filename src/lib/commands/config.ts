import { Table } from '../table';
import { Bounds } from '../helpers';

const rad = (x: number) => x * 180 / Math.PI;

function calculateBounds(L: number, h: number): [Bounds, Bounds] {
  // We proved these on Discord
  const min1 = -rad(Math.asin(h / L));
  const max1 = rad(Math.asin((L - h) / L));
  const min2 = -rad(Math.acos((h - L) / L));
  const max2 = -min1;
  return [[min1, max1], [min2, max2]];
}

export function createTableFromConfig(L: number, h: number, step: number): Table {
  const [xBounds, yBounds] = calculateBounds(L, h);
  return new Table({
    discountRate: 0.9,
    learningRate: 0.4,
    randomness: 0,
    initialCoordinates: { x: 0, y: 0 },
    step,
    xBounds,
    yBounds
  });
}
