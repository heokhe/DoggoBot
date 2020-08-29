const fakeUnityClient = new WebSocket('ws://localhost:8000');
const server = new WebSocket('ws://localhost:8000?dev');
const root = document.getElementById('table');

fakeUnityClient.onopen = () => {
  fakeUnityClient.send('config 3 1 5');
};

function render(table) {
  root.innerHTML = '';
  root.style.gridTemplateColumns = `repeat(${table.width}, 1fr)`;
  for (const cell of table.cells) {
    const {
      north, south, east, west
    } = cell;
    const cellValue = [north, south, east, west].map(a => a.value).reduce((a, b) => a + b, 0) / 4;
    root.insertAdjacentHTML('beforeend', `<div class="cell" title="(${cell.coordinates.x}, ${cell.coordinates.y})">${cellValue.toFixed(2)}</div>`);
  }
}

function updateCell(index, cellObject) {
  const {
    north, south, east, west
  } = cellObject;
  const cellValue = [north, south, east, west].map(a => a.value).reduce((a, b) => a + b, 0) / 4;
  document.querySelectorAll('.cell')[index].innerHTML = cellValue.toFixed(2);
}

let i = 0;
server.addEventListener('message', ev => {
  const data = JSON.parse(ev.data);
  if (data.type === 'table') {
    const { table } = data;
    render(table);
    fakeUnityClient.send('reward 1');
  } else if (data.type === 'update' && i < 10000) {
    updateCell(data.index, data.cell);
    fakeUnityClient.send(`reward ${Math.ceil(Math.random() * 5)}`);
    i++;
  }
});
