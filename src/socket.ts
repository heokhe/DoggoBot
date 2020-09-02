import express from 'express';
import WebSocket, { Server } from 'ws';
import { createTableFromConfig } from './lib/commands/config';
import type { Table } from './lib/table';

// TODO: --step-by-step

const port = 8000;
const ws = new Server({ port }, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});

let devClient: WebSocket;

ws.addListener('connection', (client: WebSocket, req: Request) => {
  if (!devClient && req.url.includes('?dev')) {
    devClient = client;
    devClient.addEventListener('close', () => {
      devClient = undefined;
    });
    return;
  }
  if (client === devClient) return;

  let table: Table;
  client.on('message', (msg: string) => {
    const firstSpaceIndex = msg.indexOf(' ');
    const command = msg.slice(0, firstSpaceIndex);
    const args = msg.slice(firstSpaceIndex + 1).split(' ').map(Number.parseFloat);

    if (command === 'config') {
      const [L, h, step] = args;
      table = createTableFromConfig(L, h, step);

      table.determineTheNextMove();
      const { nextCell: n, activeCell: p } = table;
      client.send(`${p.x} ${p.y} ${n.x} ${n.y}`);

      devClient?.send(JSON.stringify({ type: 'table', table }));
    } else if (command === 'reward') {
      const [cx, cy, nx, ny, reward] = args;
      const currentCell = table.activeCell;
      const { nextCell } = table;
      if (cy === currentCell.y && cx === currentCell.x
        && ny === nextCell.y && nx === nextCell.x) {
        table.update(reward);
      } else {
        throw new Error(`mismatch: ${args.join(' ')}
expected: ${[currentCell.x, currentCell.y]},${[nextCell.x, nextCell.y]}`);
      }

      table.determineTheNextMove();
      const n = table.nextCell.coordinates,
        p = nextCell.coordinates;
      client.send(`${p.x} ${p.y} ${n.x} ${n.y}`);

      devClient?.send(JSON.stringify({
        type: 'update',
        cell: currentCell,
        index: table.cells.indexOf(currentCell)
      }));
    }
  });
});

const server = express();
server.use(express.static(`${__dirname}/public`));
server.listen(port + 1, () => {
  // eslint-disable-next-line no-console
  console.log(`Dev on ${port + 1}`);
});
