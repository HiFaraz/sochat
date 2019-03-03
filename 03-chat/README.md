# Build a chat application

In this lab we will build a chat application.

Unlike previous labs where we created multiple connection listeners, in this lab we need to create one connection listener with all chat logic. This is so that we can recognize clients when we receive events.

We will build the individual chat features as pure functions that can be integrated into our master connection handler at the end.

## Overview

Here's what we'll build:

  - as a user I can join a chat session
  - as a user I can leave the chat session
  - as a user I can message everyone in the chat session
  - as a user I am informed whenever anyone else joins or leaves the chat session
  - as a user I can set my nickname
  - as a user I am informed whenever anyone changes their nickname

## Join and leave a chat session

This will just create and end a connection:

```js
// Client session:
function join(server) {
  const [host, port] = server.split(':');
  c.connect(port, host);
}
function leave() {
  c.end();
}
```

You can test this locally:

```js
// Client session
join(':8080');
leave();
```

## Broadcast to all except one client

When a client sends a chat message we need to relay that to all clients except the sender. Let's add the general ability to send messages to everyone except any one client:

```js
// Server session:
function broadcastExcept(msg, clients, exceptClient) {
  clients.forEach(c => c !== exceptClient && c.write(msg));
}
```

Test this by sending a message to all clients except the first one:
```js
// Server session:
broadcastExcept('Hello everyone except client #1!', clients, clients[0]);
```

## Change my nickname

We're going to reuse the Internet Relay Chat protocol for setting a nickname:

```js
// Client session:
function nick(name) {
  c.write(`/nick ${name}`);
}
```

## Send a chat message

This is just a simple wrapper around `c.write`:

```js
// Client session:
function send(msg) {
  c.write(msg);
}
```

## Server-side chat logic

Now we can create the server-side chat connection handling:

```js
// Server session:
s.on('connection', c => {
  let nickname = 'Anonymous';
  broadcastExcept(`${nickname} (${c.remoteAddress}) has joined the chat session.`, clients, c);
  c.on('end', () => broadcast(`${nickname} (${c.remoteAddress}) has left the chat session.`, clients));
  c.on('data', d => {
    const m = d.toString();

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
});
```

---

That's the end of this lab. Close your terminal sessions and move to the next lab.