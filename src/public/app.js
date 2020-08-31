const fakeUnityClient = new WebSocket('ws://localhost:8000');
const server = new WebSocket('ws://localhost:8000?dev');
const root = document.querySelector('main');

fakeUnityClient.onopen = () => {
  fakeUnityClient.send('config 3 1 5');
};

// eslint-disable-next-line one-var-declaration-per-line
let min, max, table;

const calculateColor = value => {
  const base = value > 0 ? '78,178,78' : '214,80,74';
  const opacity = value / (value > 0 ? max : min);
  return `rgb(${base}, ${opacity})`;
};

function setupAndRender() {
  root.style.gridTemplateColumns = `repeat(${table.width}, 1fr)`;
  for (const { avgValue, coordinates: { x, y } } of table.cells) {
    if (max === undefined || avgValue > max) max = avgValue;
    if (min === undefined || avgValue < min) min = avgValue;

    root.insertAdjacentHTML(
      'beforeend', `<div class="cell" title="(${x}, ${y})"></div>`
    );
  }
}

function update(index, cell) {
  const els = document.querySelectorAll('.cell');
  const cellValue = cell.avgValue;
  if (cellValue < min) min = cellValue;
  if (cellValue > max) max = cellValue;
  table.cells[index] = cell;

  if (min === cellValue || max === cellValue) {
    for (let i = 0; i < table.cells.length; i++) {
      els[i].style.backgroundColor = calculateColor(table.cells[i].avgValue);
    }
  } else {
    // there's no change in max or min, so we don't need to update the other cells
    els[index].style.backgroundColor = calculateColor(cellValue);
  }
}

server.addEventListener('message', ev => {
  const data = JSON.parse(ev.data);
  if (data.type === 'table') {
    ({ table } = data);
    setupAndRender();
    fakeUnityClient.send('reward 1');
  } else if (data.type === 'update') {
    update(data.index, data.cell);
    fakeUnityClient.send(`reward ${Math.ceil(Math.random() * 5)}`);
  }
});
