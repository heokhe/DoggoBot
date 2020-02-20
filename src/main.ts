import Spreax, { derived, action } from 'spreax';
import { Table } from './table';
import { getActionFromEventObject } from './functions';

const table = new Table({
  width: 4,
  height: 3,
  alpha: 0.5,
  gamma: 0.9,
  initialCoordinates: {
    x: 0,
    y: 2
  }
});
const destination = table.cellAt(3, 0);
destination.set(1);
destination.constant = true;
const trapHole = table.cellAt(3, 1);
trapHole.set(-1);
trapHole.constant = true;

const tableData = derived(
  () => table.cells.map(
    cell => [cell.active, cell.actions.map(a => a.value.toFixed(2))]
  )
);

const handleKeyDown = action((event: KeyboardEvent) => {
  const actionToTake = getActionFromEventObject(event);
  if (actionToTake) {
    table.update(actionToTake);
    tableData.compute();
  }
});

// eslint-disable-next-line no-new
new Spreax('body', {
  tableData,
  handleKeyDown
});
