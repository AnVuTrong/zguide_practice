import * as zmq from "zeromq";

async function runClient() {
  console.log("Connecting to hello world server...");

  const sock = new zmq.Request();
  sock.connect("tcp://localhost:5555");
  console.log("Client connected to tcp://localhost:5555");

  for (let i = 0; i < 1000000; i++) {
    console.log(`Sending request ${i} ...`);
    await sock.send("Hello");

    const [result] = await sock.receive();
    console.log(`Received reply ${i} [ ${result.toString()} ]`);
  }

  console.log("Client finished.");
  sock.close(); // Close the socket when done
}

runClient().catch(err => {
  console.error("Client error:", err);
  process.exit(1);
}); 