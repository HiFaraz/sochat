const net = require('net');
const s = new net.Server();
const clients = [];

// Basic server event handling.
s.on('close', () => console.log('net Stopped listening for connections and closed server.'));
s.on('error', err => console.error(err));

// Chat log utilities.
function broadcast(msg, clients) {
  clients.forEach(c => c.write(msg));
}
function broadcastExcept(msg, clients, exceptClient) {
  clients.forEach(c => c !== exceptClient && c.write(msg));
}

// Chat connection handling.
s.on('connection', c => {
  clients.push(c);
  console.log('connect', c.remoteAddress);

  c.write('Server says: Welcome to the chat session!');

  let nickname = 'Anonymous';
  broadcastExcept(`${nickname} (${c.remoteAddress}) has joined the chat session.`, clients, c);

  c.on('close', () => console.log('close', c.remoteAddress));

  c.on('data', d => {
    const m = d.toString();
    console.log('msg', c.remoteAddress, m);

    // Handle nickname changes.
    if (m.startsWith('/nick ')) {
      const newNickname = m.split(' ')[1]; // Assume non-empty nickname.
      broadcastExcept(`${nickname} (${c.remoteAddress}) has changed their nickname to ${newNickname}.`, clients, c);
      c.write(`You have changed your nickname from ${nickname} to ${newNickname}.`);
      nickname = newNickname;
      return;
    }

    // Handle chat messages.
    broadcastExcept(`${nickname} says: ${m}`, clients, c);
  });

  c.on('end', () => {
    clients.splice(clients.indexOf(c), 1);
    console.log('end', c.remoteAddress);
    broadcast(`${nickname} (${c.remoteAddress}) has left the chat session.`, clients);
  });
});

s.listen(8080, () => console.log('listen', s.address().port));
