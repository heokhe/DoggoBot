import { Cell } from './cell';
import { Direction, Action } from './action';
import { round, Bounds } from './helpers';

type TableOptions = {
  discountRate: number;
  learningRate: number;
  initialCoordinates: Coordinates;
  xBounds: Bounds;
  yBounds: Bounds;
  step: number;
  randomness: number;
}

export type Coordinates = {
  x: number;
  y: number;
}

export class Table {
  cells: Cell[];

  learningRate: number;

  discountRate: number;

  randomness: number;

  nextMove: Action | null;

  readonly initialCoordinates: Coordinates;

  readonly step: number;

  readonly width: number;

  readonly height: number;

  xBounds: Bounds;

  yBounds: Bounds;

  constructor({
    learningRate, discountRate, initialCoordinates,
    xBounds, yBounds, step, randomness
  }: TableOptions) {
    this.step = step;
    const clampedXRange = xBounds.map(x => round(x, step)) as Bounds;
    const clampedYRange = yBounds.map(y => round(y, step)) as Bounds;
    const width = (clampedXRange[1] - clampedXRange[0]) / step + 1;
    const height = (clampedYRange[1] - clampedYRange[0]) / step + 1;
    this.xBounds = clampedXRange;
    this.yBounds = clampedYRange;
    this.width = width;
    this.height = height;
    this.randomness = randomness;
    this.discountRate = discountRate;
    this.learningRate = learningRate;
    this.initialCoordinates = initialCoordinates;
    this.cells = Array.from({ length: width * height })
      .map((_, i) => new Cell(this.getCoordsFromIndex(i)));
    this.goToInitialCoordinates();
  }

  get nextCell() {
    return this.getNeighborAt(this.activeCell, this.nextMove.direction);
  }

  goToInitialCoordinates() {
    this.activateCell(
      this.cellAt(this.initialCoordinates.x, this.initialCoordinates.y)
    );
  }

  getCoordsFromIndex(index: number): Coordinates {
    const zeroBasedX = index % this.width;
    const zeroBasedY = Math.floor(index / this.width);
    const x = zeroBasedX * this.step + this.xBounds[0];
    const y = zeroBasedY * this.step + this.yBounds[0];
    return { x, y };
  }

  cellAt(x: number, y: number) {
    return this.cells.find(({ coordinates: coords }) => coords.x === x && coords.y === y);
  }

  Q(cell: Cell, action: Direction) {
    return cell.getAction(action).value;
  }

  newQ(cell: Cell, action: Direction, newCell: Cell, reward = 0) {
    const { learningRate: a, discountRate: y } = this,
      sample = y * newCell.mostValuableAction.value + reward,
      q = this.Q(cell, action);
    return (1 - a) * q + (a * sample);
  }

  getNeighborAt(cell: Cell, action: Direction) {
    const { x, y } = cell.coordinates;
    if (
      ((action === Direction.North || action === Direction.South) && this.yBounds.includes(y))
      || ((action === Direction.East || action === Direction.West) && this.xBounds.includes(x))
    ) return cell;
    switch (action) {
      case Direction.East:
        return this.cellAt(x + this.step, y);
      case Direction.North:
        return this.cellAt(x, y - this.step);
      case Direction.South:
        return this.cellAt(x, y + this.step);
      default: // East
        return this.cellAt(x - this.step, y);
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

  determineTheNextMove() {
    this.nextMove = this.activeCell.decide(this.randomness);
  }

  update(reward: number) {
    const { activeCell, nextCell, nextMove } = this;
    this.activateCell(nextCell);
    activeCell.setAction(
      nextMove.direction, this.newQ(activeCell, nextMove.direction, nextCell, reward)
    );
    this.nextMove = undefined;
  }

  reset() {
    for (const cell of this.cells)
      cell.set(0);
    this.goToInitialCoordinates();
  }
}
