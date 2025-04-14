import * as zmq from "zeromq";

async function runClient() {
  console.log("Collecting updates from weather server...");

  const sock = new zmq.Subscriber();
  sock.connect("tcp://localhost:5556");

  // Subscribe to zipcode, default is NYC, 10001
  const zip_filter = process.argv[2] || "10001"; // Get zipcode from command line argument or default
  sock.subscribe(zip_filter);
  console.log(`Subscribed to zipcode ${zip_filter}`);

  // Process 5 updates
  let total_temp = 0;
  const updatesToProcess = 5;
  for (let update_nbr = 0; update_nbr < updatesToProcess; update_nbr++) {
    const [topic, msg] = await sock.receive(); // Receive as [topic, message]
    if (!msg) {
      console.error("Received undefined message");
      continue; // Skip if message is undefined
    }
    const string = msg.toString();
    console.log(`Received update ${update_nbr + 1}: ${string}`);
    const [zipcode, temperatureStr, relhumidityStr] = string.split(" ");

    // Ensure temperature is a valid number before parsing
    const temperature = parseInt(temperatureStr, 10);
    if (!isNaN(temperature)) {
      total_temp += temperature;
    } else {
      console.warn(`Invalid temperature value received: ${temperatureStr}`);
    }
  }

  const average_temp = total_temp / updatesToProcess;
  console.log(
    `Average temperature for zipcode '${zip_filter}' was ${average_temp.toFixed(2)} F`
  );

  sock.close(); // Close the socket when done
  console.log("Client finished.");
}

runClient().catch(err => {
  console.error("Client error:", err);
  process.exit(1);
}); 