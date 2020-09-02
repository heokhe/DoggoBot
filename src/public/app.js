const fakeUnityClient = new WebSocket('ws://localhost:8000');
const server = new WebSocket('ws://localhost:8000?dev');
const root = document.querySelector('main');

// eslint-disable-next-line one-var-declaration-per-line
let px, py, cx, cy;

fakeUnityClient.onopen = () => {
  fakeUnityClient.send('config 3 1 5');
};
fakeUnityClient.onmessage = ({ data }) => {
  [px, py, cx, cy] = data.split(' ');
  fakeUnityClient.send(`
    reward ${px} ${py} ${cx} ${cy} ${Math.ceil(Math.random() * 10) - 4}
  `.trim());
};

// eslint-disable-next-line one-var-declaration-per-line
let min, max, table;
let mostUpdatedCell,
  avgUC = 0;

const calculateColor = value => {
  const base = value > 0 ? '78,178,78' : '214,80,74';
  const opacity = (value / (value > 0 ? max : min)) ** 0.7;
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

function writeTheSize() {
  const el = document.getElementById('size');
  el.innerText = `${table.width}${el.innerText}${table.height} (${table.width * table.height})`;
}

function writeTheAverageUC() {
  document.getElementById('avguc').innerText = avgUC.toFixed(2);
}

function writeTheMaximumUC() {
  document.getElementById('maxuc').innerText = `
    ${mostUpdatedCell.updatesCount} (at ${mostUpdatedCell.coordinates.x}, ${mostUpdatedCell.coordinates.y})
  `.trim();
}

function update(index, cell) {
  const els = document.querySelectorAll('.cell');
  table.cells[index] = cell;
  const cellValue = cell.avgValue;
  if (cellValue < min) min = cellValue;
  if (cellValue > max) max = cellValue;

  if (min === cellValue || max === cellValue) {
    for (let i = 0; i < table.cells.length; i++) {
      els[i].style.backgroundColor = calculateColor(table.cells[i].avgValue);
    }
  } else {
    // there's no change in max or min, so we don't need to update the other cells
    els[index].style.backgroundColor = calculateColor(cellValue);
  }

  if (cell.updatesCount > mostUpdatedCell.updatesCount) {
    mostUpdatedCell = cell;
    writeTheMaximumUC();
  }
  avgUC += 1 / table.cells.length;
}

server.addEventListener('message', ev => {
  const data = JSON.parse(ev.data);
  if (data.type === 'table') {
    ({ table } = data);
    writeTheSize();
    writeTheAverageUC();
    [mostUpdatedCell] = table.cells;
    writeTheMaximumUC();
    setupAndRender();
  } else if (data.type === 'update') {
    update(data.index, data.cell);
    writeTheAverageUC();
  }
});
