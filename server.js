import {Server} from "net";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from "readline";
import { send } from "process";

// We are binding the server to all available network interfaces using the IP address 0.0.0.0. I mean we are hearing on all interfaces
const host = "0.0.0.0";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

//127.0.0.1:60800 => "Pepito";
//127.0.0.1:50118 => "Juanito";
const connections = new Map();

const error = (message) => {
  console.log(message);
  process.exit(1);
}

const sendMessageToOthers = (message, origin) => {
  for(let socket of connections.keys()){
    if(socket !== origin){
      socket.write(message)
    }
  }
}

const listen = (port) => {
  const server = new Server();
  
  // when a client connects to the server it will emit a 'connection' event that show the remote address and port of the client
  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`New connection from ${remoteSocket}`);
    //We are listening for data from the client using the 'data' event
    socket.on("data", (data) => {
      if(!connections.has(socket)){
        console.log(`Username ${data} set for connection ${remoteSocket}`);
        connections.set(socket, data.toString().trim());
      } else if (data.toString().trim() === "end") {
        connections.delete(socket);
        socket.end("Connection closed by server\n");
      } else {
        const fullMessage = `[${connections.get(socket)}]: ${data}`;
        console.log(`${remoteSocket} -> ${fullMessage}`);
        sendMessageToOthers(fullMessage, socket);
      }
    });
    socket.on("close", () => {
      console.log(`Connection closed from ${remoteSocket}`);
    });
    socket.on("error", (err) => error(err.message));
  });

  server.listen({host, port}, () => {
    console.log(`Listening on port ${port}`);
  });

  server.on("error", (err) => error(err.message));
};

const main = () => {
  if(process.argv.length !== 3){
    error(`Usage: node ${__filename} port`);
  }
  let port = process.argv[2];
  if(isNaN(port)){
    error(`Port must be a number`);
  }
  port = Number(port);
  listen(port);
}



if (import.meta.url === `file:\/\/${process.argv[1]}`) {
	main();
}