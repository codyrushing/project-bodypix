import ws from 'ws';

const wss = new ws.Server({ port: 8080 });

wss.on('connection', function connection(client) {
  client.on('message', function incoming(message) {
    console.log(JSON.parse(message).length);
  });

  client.send('something');
});