import { Table } from './lib/table';
import { Direction } from './lib/action';

export function loadFromJson(table: Table, jsonString: string) {
  const savedData: [boolean, string[]][] = JSON.parse(jsonString);
  for (let i = 0; i < savedData.length; i++) {
    const [isActive, [north, east, west, south]] = savedData[i],
      cell = table.cells[i];
    if (isActive)
      table.activateCell(cell);
    cell.setAction(Direction.North, parseFloat(north));
    cell.setAction(Direction.East, parseFloat(east));
    cell.setAction(Direction.West, parseFloat(west));
    cell.setAction(Direction.South, parseFloat(south));
  }
}

export function makeCellsConstant(table: Table) {
  const destination = table.cellAt(3, 0);
  destination.set(1);
  destination.constant = true;
  const trapHole = table.cellAt(3, 1);
  trapHole.set(-1);
  trapHole.constant = true;
}
