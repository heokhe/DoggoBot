import { Cell } from './cell';
import { Direction } from './action';

const round = (x: number, s: number) => {
  if (x < 0) return Math.floor(x / s) * s;
  return Math.ceil(x / s) * s;
};

type Range = [number, number];

type TableOptions = {
  discount: number;
  learningRate: number;
  initialCoordinates: Coordinates;
  xRange: Range;
  yRange: Range;
  step: number;
}

export type Coordinates = {
  x: number;
  y: number;
}

export class Table {
  cells: Cell[];

  alpha: number;

  learningRate: number;

  initialCoordinates: Coordinates;

  step: number;

  width: number;

  height: number;

  xRange: Range;

  yRange: Range;

  constructor({
    learningRate, discount, initialCoordinates,
    xRange, yRange, step
  }: TableOptions) {
    this.step = step;
    const clampedXRange = xRange.map(x => round(x, step)) as Range;
    const clampedYRange = yRange.map(y => round(y, step)) as Range;
    const width = (clampedXRange[1] - clampedXRange[0]) / step + 1;
    const height = (clampedYRange[1] - clampedYRange[0]) / step + 1;
    this.xRange = clampedXRange;
    this.yRange = clampedYRange;
    this.width = width;
    this.height = height;
    this.learningRate = discount;
    this.alpha = learningRate;
    this.initialCoordinates = initialCoordinates;
    this.cells = Array.from({ length: width * height })
      .map((_, i) => new Cell(this.getCoordsFromIndex(i)));
    this.goToInitialCoordinates();
  }

  goToInitialCoordinates() {
    this.activateCell(
      this.cellAt(this.initialCoordinates.x, this.initialCoordinates.y)
    );
  }

  getCoordsFromIndex(index: number): Coordinates {
    const zeroBasedX = index % this.width;
    const zeroBasedY = Math.floor(index / this.width);
    const x = zeroBasedX * this.step + this.xRange[0];
    const y = zeroBasedY * this.step + this.yRange[0];
    return { x, y };
  }

  cellAt(x: number, y: number) {
    return this.cells.find(({ coordinates: coords }) =>
      coords.x === x && coords.y === y);
  }

  Q(cell: Cell, action: Direction) {
    return cell.getAction(action).value;
  }

  newQ(cell: Cell, action: Direction, newCell: Cell) {
    const { alpha: a, learningRate: y } = this,
      sample = y * newCell.mostValuableAction.value,
      q = this.Q(cell, action);
    return (1 - a) * q + (a * sample);
  }

  getNeighborAt(cell: Cell, action: Direction) {
    const { x, y } = cell.coordinates;
    switch (action) {
      case Direction.East:
        return this.cellAt(x + 1, y);
      case Direction.North:
        return this.cellAt(x, y - 1);
      case Direction.South:
        return this.cellAt(x, y + 1);
      default: // East
        return this.cellAt(x - 1, y);
    }
  }

  get activeCell() {
    return this.cells.find(cell => cell.active);
  }

  activateCell(cell: Cell) {
    if (this.activeCell)
      this.activeCell.active = false;
    cell.active = true;
  }

  /**
   * Calculates the new Q-values, and updates the cells.
   */
  update(action: Direction) {
    const currentCell = this.activeCell;
    const newCell = this.getNeighborAt(currentCell, action) ?? currentCell;
    this.activateCell(newCell);
    currentCell.setAction(action, this.newQ(currentCell, action, newCell));
  }

  reset() {
    for (const cell of this.cells)
      cell.set(0);
    this.goToInitialCoordinates();
  }
}
