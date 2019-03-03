const readline = require('readline');
const net = require('net');

const c = new net.Socket();
let joined = false;

// Connection handling
c.on('connect', () => {
  joined = true;
  console.log(`You have joined a chat session at ${c.remoteAddress}:${c.remotePort}.`);
});
c.on('data', d => console.log(d.toString()));
c.on('end', () => {
  joined = false;
  console.log('You have left the chat session.');
});
c.on('error', err => console.error('Error', err));

// Chat commands
const cmds = {};
cmds.join = server => {
  if (joined) {
    console.error('Error: you are already in a chat session. You have to leave it first before joining another session.');
    return;
  }
  const [host, port] = server.split(':');
  c.connect(port, host);
}
cmds.leave = () => {
  if (!joined) {
    console.error('Error: you are not in a chat session.');
    return;
  }
  c.end();
  joined = false;
}
cmds.nick = false; // Send the command as a message to the server, don't run locally.
cmds.exit = () => process.exit();
function send(msg) {
  if (!joined) {
    console.error('Error: you are not in a chat session. Join a chat session first before sending a message or command to the chat server.');
    return;
  }
  c.write(msg);
}

// REPL integration
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ' '
});

rl.prompt();

rl.on('line', (line) => {
  if (line.trim() !== '') {
    execute(line.trim());
  }
  rl.prompt();
}).on('close', () => {
  cmds.leave();
  process.exit(0);
});

function execute(line) {
  if (line.startsWith('/')) {
    // Try to parse as command first.
    const [arg0, ...args] = line.split(' ');
    const cmd = arg0.slice(1);
    if (cmds[cmd] === undefined) {
      console.error(`Error: ${arg0} is an unknown command.`);
      return;
    } else if (cmds[cmd] === false) {
      // No operation. Continue to sending as a message.
    } else {
      cmds[cmd](...args);
      return;
    }
  }
  
  // Send as message.
  send(line);
}




