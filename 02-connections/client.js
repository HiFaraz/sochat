const net = require('net');
global.c = new net.Socket();

c.on('close', () => console.log('net Connection closed.', c.remoteAddress));
c.on('connect', () => console.log(`net Connected to ${c.remoteAddress}:${c.remotePort}.`));
c.on('data', d => console.log('net Message', c.remoteAddress, d.toString()));
c.on('end', () => console.log('net Socket FIN.', c.remoteAddress));
c.on('error', err => console.error(err));