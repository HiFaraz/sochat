# Integrating with a REPL

It's not natural to call JavaScript functions to chat with others. This lab gives you a nicer interface by integrating the chat logic with a Read-Eval-Print-Loop (REPL).

This is the final lab and the understanding the code is left as an exercise to the reader.

In this lab, start your sessions by directly running the `client` and `server` scripts:

```sh
# Start the client session:
node ./

## Start the server

```sh
# Server session:
 listen 8080
```

## Start chatting!

```sh
# Client session:
 /join :8080
Welcome to the chat session.
 /nick CoolDev
Your nickname is now CoolDev.
 Hi everone!
AwesomeQE says: Hey CoolDev!
 Nice to see you folks! Gtg!
 /leave
You have left the chat session.
 /exit
```

---

That's the end of this lab. Close your terminal sessions.