# Work with sockets

In this lab we will learn how to create sockets for a client and server and pass messages between them.

## Create the sockets

Let's create the base objects that give us socket access:

```js
// Client session:
const net = require('net');
c = new net.Socket();

// Server session:
const net = require('net');
s = new net.Server();
```

This is as close as you get in Node.js to the raw sockets. Node.js still creates abstractions in between for event-handling and accepting connections. To go deeper you'd have to make syscalls to the kernal directly in languages such as C, C++, Go, or Rust.

Nothing is happening yet though. Let's kick off some actions.

## Connect the client to the server

Sockets are fundamentally event-based, both in Node.js and also in Linux itself. In Node.js a socket is actually an `EventEmitter` as well. First let's add some basic reporting so we can see what's happening:

```js
// Client session:
c.on('error', err => console.error(err));

// Server session:
s.on('error', err => console.error(err));
```

Now let's create a connection:

```js
// Client session:
c.connect(8080);
```

You'll see an error:

```js
{ Error: connect ECONNREFUSED 127.0.0.1:8080
    at Object._errnoException (util.js:1022:11)
    at _exceptionWithHostPort (util.js:1044:20)
    at TCPConnectWrap.afterConnect [as oncomplete] 
(net.js:1198:14)
  code: 'ECONNREFUSED',
  errno: 'ECONNREFUSED',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 8080 }
```

This is because your server isn't listening on port `8080` yet. Remember that sockets are event-based, so when we say "listening" we are listening for events.

Let's fix this:

```js
// Server session:
s.listen(8080, () => console.log(`net Bound and listening on address ${s.address()}.`));
```

Now we try to connect again and check that `c.writable` is `true` (indiciating the connection is open):

```js
// Client session:
c.connect(8080);
c.writable; // true
```

Close this connection for now and check that `c.writable` is `false`:

```js
// Client session:
c.end();
c.writable; // false
```

## Accepting connections and sending data to the server

So far we created sockets and connected them. Now it's time to send data!

Let's add some connection-handling:

```js
// Client session:
c.on('connect', () => console.log(`net Connected to ${c.remoteAddress}:${c.remotePort}.`));

// Server session:
s.on('connection', c => {
  console.log('net Incoming connection.', c.remoteAddress);
  c.on('data', d => console.log('net Message', c.remoteAddress, d.toString()));
  c.on('end', () => console.log('net Socket FIN.', c.remoteAddress));
  c.on('close', () => console.log('net Connection closed.', c.remoteAddress));
});
```

## Send data back to the client

We can send data both ways:

```js
// Client session:
c.on('data', d => console.log('net Message', c.remoteAddress, d.toString()));
c.on('end', () => console.log('net Socket FIN.', c.remoteAddress));
c.on('close', () => console.log('net Connection closed.', c.remoteAddress));

// Server session:
s.on('connection', c => {
  c.write('Welcome to server!');
  c.on('data', d => c.write('Hello to you too!'));
});
```

## Next steps

This code is OK for handling connections individually. Let's see some code for handling connections in bulk. Clean up your sockets first:

```js
// Client session
c.end();

// Server session:
s.on('close', () => console.log('net Stopped listening for connections and closed server.'));
s.close();
```

---

That's the end of this lab. Close your terminal sessions and move to the next lab.