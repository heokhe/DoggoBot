import { Cell } from './cell';
import { Direction } from './action';

type TableOptions = {
  width: number;
  height: number;
  gamma: number;
  alpha: number;
  initialCoordinates: Coordinates;
}

export type Coordinates = {
  x: number;
  y: number;
}

export class Table {
  width: number;

  height: number;

  cells: Cell[];

  alpha: number;

  gamma: number;

  initialCoordinates: Coordinates;

  constructor({
    alpha, gamma, height, width, initialCoordinates
  }: TableOptions) {
    this.width = width;
    this.height = height;
    this.gamma = gamma;
    this.alpha = alpha;
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
    return {
      y: Math.floor(index / (this.height + 1)),
      x: index % this.width
    };
  }

  cellAt(x: number, y: number) {
    return this.cells.find(({ coordinates: coords }) =>
      coords.x === x && coords.y === y);
  }

  Q(cell: Cell, action: Direction) {
    return cell.getAction(action).value;
  }

  newQ(cell: Cell, action: Direction, newCell: Cell) {
    const { alpha: a, gamma: y } = this,
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
