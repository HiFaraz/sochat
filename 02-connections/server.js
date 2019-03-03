const net = require('net');
global.s = new net.Server();

s.on('close', () => console.log('net Stopped listening for connections and closed server.'));

s.on('connection', c => {
  console.log('net Incoming connection.', c.remoteAddress);
  c.on('data', d => console.log('net Message', c.remoteAddress, d.toString()));
  c.on('end', () => console.log('net Socket FIN.', c.remoteAddress));
  c.on('close', () => console.log('net Connection closed.', c.remoteAddress));
});

s.on('connection', c => {
  c.write('Welcome to server!');
  c.on('data', d => c.write('Hello to you too!'));
});

s.on('error', err => console.error(err));

s.listen(8080, () => console.log('net Bound and listening on address', s.address()));