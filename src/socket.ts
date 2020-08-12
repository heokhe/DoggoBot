import { Server } from 'ws';

const ws = new Server({
  port: 8000
}, () => {
  console.log('Listening on port 8000.');
});

ws.addListener('connection', client => {
  client.on('message', (msg: string) => {
    const [x, y] = msg.split(' ').map(Number.parseFloat);
    client.send(`[OK] x = ${x}, y = ${y}`);
  });
});
