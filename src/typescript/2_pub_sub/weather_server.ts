import * as zmq from "zeromq";

// Function to generate a random integer within a range
function randrange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runServer() {
  const sock = new zmq.Publisher();

  await sock.bind("tcp://*:5556");
  console.log("Weather update server listening on tcp://*:5556");

  while (true) {
    const zipcode = randrange(1, 100000);
    const temperature = randrange(-80, 135);
    const relhumidity = randrange(10, 60);

    const update = `${zipcode} ${temperature} ${relhumidity}`;
    console.log(`Sending update: ${update}`);
    await sock.send(update);

    // Add a small delay to prevent tight loop and high CPU usage
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

runServer().catch(err => {
  console.error("Server error:", err);
  process.exit(1);
}); 