import {Socket} from "net";
// Adding readline to read input from the console after the execution of the script
import readline from 'readline';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const error = (message) => {
	console.log(message);
	process.exit(1);
};


const connect = (host, port) => {
	const socket = new Socket();

	//We are not establishing our port and host until we call the connect method, and the port will be randomly assigned by the OS and the host will be localhost by default
	socket.connect({host, port}, () => {
		console.log(`Connected to server at ${host}:${port}`);
		rl.question("Enter your username: ", (username) => {
			socket.write(username);
      console.log(`Type any message to send it, type end to finish the connection`);
		});
		//We can send data to the server using the write method
		rl.on("line", (input) => {
			console.log(`You typed: ${input}`);
			socket.write(input);
			if (input.toString().trim() === "end") {
				socket.end("Connection closed by client\n");
			}
		});
	});

	//We are listening for data from the server using the 'data' event
	socket.on("data", (data) => {
		console.log(`${data}`);
	});

	socket.on("close", () => {
		process.exit(0);
	});
  
  socket.on("error", (err) => console.log(err.message));
}

const main = () => {
  if (process.argv.length !== 4) {
		error(`Usage: node ${__filename} host port`);
	}
  let [ , , host, port] = process.argv;
  if(isNaN(port)){
    error("Port must be a number");
  }
  port = Number(port);
  connect(host, port);
}

if(import.meta.url === `file:\/\/${process.argv[1]}`){
  main();
}

