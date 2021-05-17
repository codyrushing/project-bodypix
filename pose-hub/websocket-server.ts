import ws from 'ws';
import { getVertices } from './bitmap';

const wss = new ws.Server({ port: 8080 });

wss.on('connection', function connection(client) {
  client.on('message', function incoming(message) {
    const bitmap = JSON.parse(message);
    console.log(getVertices(bitmap));
  });
});