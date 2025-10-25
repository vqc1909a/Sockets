# Sockets in Node.js

## What is a Socket?

A socket is an endpoint for sending or receiving data across a computer network. In Node.js, sockets are commonly used for real-time communication between a server and one or more clients.

## Types of Sockets

- **TCP Sockets**: Reliable, connection-oriented communication (used by the `net` module in Node.js).
- **UDP Sockets**: Unreliable, connectionless communication (handled by the `dgram` module).

## How Sockets Work

1. **Server** creates a socket and listens on a port.
2. **Client** creates a socket and connects to the server's IP and port.
3. Both can send and receive data as long as the connection is open.
4. Either side can close the connection.

## Example: TCP Socket Server (Node.js)

```js
import {Server} from "net";
const server = new Server();

server.on("connection", (socket) => {
	console.log("New connection:", socket.remoteAddress, socket.remotePort);
	socket.on("data", (data) => {
		console.log("Received:", data.toString());
		socket.write("Echo: " + data);
	});
	socket.on("close", () => {
		console.log("Connection closed");
	});
});

server.listen({host: "0.0.0.0", port: 8080}, () => {
	console.log("Server listening on port 8080");
});
```

## Example: TCP Socket Client (Node.js)

```js
import {Socket} from "net";
const socket = new Socket();

socket.connect({host: "127.0.0.1", port: 8080}, () => {
	console.log("Connected to server");
	socket.write("Hello, server!");
});

socket.on("data", (data) => {
	console.log("Received from server:", data.toString());
});

socket.on("close", () => {
	console.log("Connection closed");
});
```

## Key Methods and Events

- `socket.write(data)`: Send data to the other end.
- `socket.on('data', callback)`: Listen for incoming data.
- `socket.end()`: Gracefully close the connection.
- `socket.on('close', callback)`: Listen for connection closure.

## Common Use Cases

- Real-time chat applications
- Multiplayer games
- Live data feeds
- Remote control systems

## Notes

- Always handle errors and connection closures to avoid crashes.
- For browser-based real-time communication, consider using WebSockets (e.g., with the `ws` or `socket.io` libraries).

## Cross-language Compatibility

Sockets are a universal networking concept and can be used across many programming languages, such as Python, Java, C, Go, and more. This means you can create a server in one language (e.g., Node.js) and a client in another (e.g., Python), as long as they use the same protocol (like TCP or UDP) and agree on the data format.

---

This project demonstrates basic TCP socket usage in Node.js for educational purposes.
