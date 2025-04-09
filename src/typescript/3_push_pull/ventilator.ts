import * as zmq from "zeromq";
import * as readline from 'readline';

// Function to generate a random integer within a range
function randrange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runVentilator() {
  console.log("Initializing ventilator...");
  const context = new zmq.Context();

  // Socket to send messages on
  const sender = new zmq.Push();
  await sender.bind("tcp://*:5557");
  console.log("Ventilator bound to tcp://*:5557");

  // Socket with direct access to the sink: used to synchronize start of batch
  const sink = new zmq.Push();
  sink.connect("tcp://localhost:5558");
  console.log("Ventilator connected to sink at tcp://localhost:5558");

  console.log("Ventilator ready!");

  // Wait for user input to start
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  await new Promise<void>(resolve => {
    rl.question("Press Enter when the workers are ready: ", () => {
      rl.close();
      resolve();
    });
  });

  console.log("Sending tasks to workers...");

  // The first message is "0" and signals start of batch to the sink
  await sink.send("0");
  console.log("Sent start signal to sink.");

  // Send 100 tasks
  let total_msec = 0;
  const numTasks = 100;

  for (let task_nbr = 0; task_nbr < numTasks; task_nbr++) {
    // Random workload from 1 to 100 msecs
    const workload = randrange(1, 100);
    total_msec += workload;

    await sender.send(workload.toString());
    // console.log(`Sent task ${task_nbr + 1}: workload ${workload}ms`); // Optional: log sent tasks
  }

  console.log(`Total expected cost: ${total_msec} msec`);

  // Give 0MQ time to deliver messages before closing sockets
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("Ventilator finished.");
  sender.close();
  sink.close();
  // context.close(); // Close context if needed, usually at the end of the application
}

runVentilator().catch(err => {
  console.error("Ventilator error:", err);
  process.exit(1);
}); 