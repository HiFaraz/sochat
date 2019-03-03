# Work with multiple connections

In this lab we will learn how to operate on multiple client connections.

## Gracefully closing the server

In the last lab we could not close our server until all connections were closed. Let's fix that:

```js
// Server session:
const clients = [];

s.on('connection', c => {
  clients.push(c);
  c.on('end', () => clients.splice(clients.indexOf(c), 1));
});

function close(s, clients) {
  console.log('Close all client connections.');
  clients.forEach(c => c.end());
  console.log('Close the server.');
  s.close();
}
```

Let's test force-closing a server now:

```js
// Client session:
c.connect(8080);

// Server session:
close(s, clients);
```

You should see this output:

```
// Client session:
net Socket FIN. 127.0.0.1
net Connection closed. 127.0.0.1

// Server session:
Close all client connections.
Close the server.
net Socket FIN. ::ffff:127.0.0.1
net Stopped listening for connections and closed server.
net Connection closed. ::ffff:127.0.0.1
```

## Broadcast to all clients

Now that we're storing all client connections it's simple and easy to broadcast to all clients!

Here we go:

```js
// Server session:
function broadcast(msg, clients) {
  clients.forEach(c => c.write(msg));
}

broadcast('Hello everyone!', clients);
```

---

That's the end of this lab. Close your terminal sessions and move to the next lab.