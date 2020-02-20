import Spreax, { action, derived, state, setPath } from 'spreax';
import { Table } from './table';
import { ActionDirection } from './action';

const table = new Table({
  width: 4,
  height: 3,
  alpha: .5,
  gamma: .9,
  initialCoordinates: {
    x: 0,
    y: 2
  }
});
const destination = table.cellAt(3, 0);
for (const action of destination.actions) { 
  action.value = 1;
}
const tableData = derived(
  () => table.cells.map(
    cell => [cell.active, cell.actions.map(a => a.value.toFixed(2))]
  )
)
const handleKeyDown = action((event: KeyboardEvent) => {
  const { code } = event;
  if (!code.startsWith('Arrow')) return;
  const directionString = code.slice(5).toLowerCase();
  const currentCell = table.activeCell;
  const direction: ActionDirection = {
    up: ActionDirection.North,
    down: ActionDirection.South,
    right: ActionDirection.East,
    left: ActionDirection.West
  }[directionString];
  const newCell = table.getNeighborAt(currentCell, direction) ?? currentCell;
  if (newCell !== currentCell) {
    newCell.active = true;
    currentCell.active = false;
  }
  currentCell.getAction(direction).value = table.newQ(currentCell, direction, newCell);
  tableData.compute();
})
const app = new Spreax('body', {
  tableData,
  handleKeyDown
})
globalThis.app = app;