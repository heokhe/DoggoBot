import Spreax, { derived, action } from 'spreax';
import { Table } from './lib/table';
import { getActionFromEventObject, createColor } from './functions';
import { loadFromJson, makeCellsConstant } from './table-state';

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
const savedString = localStorage.getItem('table-data');
if (savedString) loadFromJson(table, savedString);
makeCellsConstant(table);

const tableData = derived(
  () => table.cells.map(
    cell => [cell.active, cell.actions.map(a => a.value.toFixed(2))]
  )
);
tableData.subscribe(data =>
  localStorage.setItem('table-data', JSON.stringify(data)),
true);

const handleKeyDown = action((event: KeyboardEvent) => {
  if (event.code === 'Backspace' && event.ctrlKey) {
    table.reset();
    makeCellsConstant(table);
  } else {
    const actionToTake = getActionFromEventObject(event);
    if (actionToTake)
      table.update(actionToTake);
  }
  tableData.compute();
});

// eslint-disable-next-line no-new
new Spreax('body', {
  tableData,
  handleKeyDown,
  createColor: action((_, x: number) => createColor(x))
});
