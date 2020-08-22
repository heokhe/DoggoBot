import { Server } from 'ws';

const port = 8000;
const ws = new Server({ port }, () => {
  console.log(`Listening on port ${port}`);
});

ws.addListener('connection', client => {
  client.on('message', (msg: string) => {
    const [x, y] = msg.split(' ').map(Number.parseFloat);
    client.send(`[OK] x = ${x}, y = ${y}`);
  });
});
