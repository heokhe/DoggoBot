import express from 'express';
import WebSocket, { Server } from 'ws';
import { createTableFromConfig } from './lib/commands/config';
import type { Table } from './lib/table';
import { getRandomDirection } from './lib/helpers';

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
  let i = 0;
  client.on('message', (msg: string) => {
    const firstSpaceIndex = msg.indexOf(' ');
    const command = msg.slice(0, firstSpaceIndex);
    const args = msg.slice(firstSpaceIndex + 1).split(' ').map(Number.parseFloat);

    if (command === 'config') {
      const [L, h, step] = args;
      table = createTableFromConfig(L, h, step);
      table.determineTheNextMove();
      const { x, y } = table.nextCell.coordinates;
      client.send(`${x} ${y} ${i}`);
      i++;
      devClient?.send(JSON.stringify({ type: 'table', table }));
    } else if (command === 'reward') {
      const [reward, _movementId] = args;
      const c = table.activeCell;
      table.update(reward);
      const { x, y } = c.coordinates;
      client.send(`${x} ${y} ${i}`);
      i++;
      devClient?.send(JSON.stringify({
        type: 'update',
        cell: c,
        index: table.cells.indexOf(c)
      }));
      table.determineTheNextMove();
    }
  });
});

const server = express();
server.use(express.static(`${__dirname}/public`));
server.listen(port + 1, () => {
  // eslint-disable-next-line no-console
  console.log(`Dev on ${port + 1}`);
});
