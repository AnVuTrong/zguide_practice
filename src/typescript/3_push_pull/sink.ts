import * as zmq from "zeromq";
import { performance } from 'perf_hooks';

async function runSink() {
  console.log("Initializing sink...");
  const context = new zmq.Context();

  // Socket to receive messages on
  const receiver = new zmq.Pull();
  await receiver.bind("tcp://*:5558");
  console.log("Sink bound to tcp://*:5558");

  console.log("Sink ready!");

  // Wait for start of batch signal from ventilator
  const [startSignal] = await receiver.receive();
  console.log("Received start signal from ventilator:", startSignal.toString());

  // Start our clock now
  console.log("Starting clock...");
  const tstart = performance.now();

  // Process 100 confirmations
  const numTasks = 100;
  for (let task_nbr = 0; task_nbr < numTasks; task_nbr++) {
    const [confirmation] = await receiver.receive(); // Receive confirmation
    if (task_nbr % 10 === 0) {
      process.stdout.write(':');
      // console.log(`\nReceived confirmation number ${task_nbr + 1}`); // Optional detail
    } else {
      process.stdout.write('.');
    }
  }
  process.stdout.write('\n'); // Newline after dots

  // Calculate and report duration of batch
  const tend = performance.now();
  const duration = tend - tstart;
  console.log(`Total elapsed time: ${duration.toFixed(2)} msec`);

  console.log("Sink finished.");
  receiver.close();
  // context.close(); // Close context if needed
}

runSink().catch(err => {
  console.error("Sink error:", err);
  process.exit(1);
}); 