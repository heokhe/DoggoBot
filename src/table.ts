import { Cell } from './cell';
import { ActionDirection, Action } from './action';

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
  constructor({
    alpha, gamma, height, width, initialCoordinates
  }: TableOptions) {
    this.width = width;
    this.height = height;
    this.gamma = gamma;
    this.alpha = alpha;
    this.cells = Array.from({ length: width * height})
      .map((_, i) => new Cell(this.getCoordsFromIndex(i)));
    this.cellAt(initialCoordinates.x, initialCoordinates.y).active = true;
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

  Q(cell: Cell, action: ActionDirection) {
    return cell.getAction(action).value;
  }

  newQ(cell: Cell, action: ActionDirection, newCell: Cell) {
    const sample = this.gamma * newCell.mostValuableAction.value;
    console.log('Q(s,a) = ' + this.Q(cell, action));
    console.log('(1-a)Q(s,a) = ' + (1-this.alpha)*this.Q(cell, action));
    console.log('sample = ' + sample);
    return ((1 - this.alpha) * this.Q(cell, action)) + (this.alpha * sample);
  }

  getNeighborAt(cell: Cell, action: ActionDirection) {
    const { x, y } = cell.coordinates;
    switch (action) {
      case ActionDirection.East:
        return this.cellAt(x + 1, y)
      case ActionDirection.North:
        return this.cellAt(x, y - 1)
      case ActionDirection.South:
        return this.cellAt(x, y + 1)
      case ActionDirection.West:
        return this.cellAt(x - 1, y)
    }
  }

  get activeCell() {
    return this.cells.find(cell => cell.active);
  }

  activateCell(cell: Cell) {
    this.activeCell.active = false;
    cell.active = true;
  }

  /**
   * Calculates the new Q-values, and updates the cells.
   */
  update(action: ActionDirection) {
    const currentCell = this.activeCell;
    const newCell = this.getNeighborAt(currentCell, action) ?? currentCell;
    this.activateCell(newCell);
    currentCell.setAction(action, this.newQ(currentCell, action, newCell));
  }
}