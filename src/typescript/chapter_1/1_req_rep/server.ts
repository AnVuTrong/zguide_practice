import * as zmq from "zeromq";
import { performance } from 'perf_hooks'; // Use perf_hooks for more accurate timing

async function runServer() {
  const sock = new zmq.Reply();

  await sock.bind("tcp://*:5555");
  console.log("Server listening on tcp://*:5555");

  for await (const [msg] of sock) {
    console.log("Received request:", msg.toString());

    // Do some 'work'
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate work with async delay

    // Send reply back to client
    const reply = `World, time: ${new Date().toISOString()}`;
    await sock.send(reply);
    console.log("Sent reply:", reply);
  }
}

runServer().catch(err => {
  console.error("Server error:", err);
  process.exit(1);
}); 