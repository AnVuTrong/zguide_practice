import * as zmq from "zeromq";

async function runWorker() {
  const context = new zmq.Context();

  // Socket to receive messages on
  const receiver = new zmq.Pull();
  receiver.connect("tcp://localhost:5557");
  console.log("Worker connected to ventilator at tcp://localhost:5557");

  // Socket to send messages to
  const sender = new zmq.Push();
  sender.connect("tcp://localhost:5558");
  console.log("Worker connected to sink at tcp://localhost:5558");

  console.log("Worker ready!");

  // Process tasks forever
  for await (const [msg] of receiver) {
    const workload = parseInt(msg.toString(), 10);

    // Simple progress indicator for the viewer
    process.stdout.write('.'); // Use process.stdout.write for no newline

    // Do the work
    if (!isNaN(workload)) {
        await new Promise(resolve => setTimeout(resolve, workload));
    } else {
        console.warn(`\nReceived invalid workload: ${msg.toString()}`);
    }

    // Send results to sink
    await sender.send(""); // Send an empty message to indicate completion
  }

  // These lines might not be reached in a typical worker loop unless receiver closes
  receiver.close();
  sender.close();
  // context.close();
}

runWorker().catch(err => {
  console.error("\nWorker error:", err);
  process.exit(1);
}); 