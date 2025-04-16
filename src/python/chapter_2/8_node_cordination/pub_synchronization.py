#
# Synchronized Publisher Pattern Example
#
# This script demonstrates a publisher that waits for a specific number
# of subscribers to connect and signal readiness before it starts
# publishing messages. This prevents the publisher from sending data
# that no subscriber is ready to receive yet (the "slow joiner" problem).
#
import zmq

# Define the number of subscribers we need to connect before publishing.
SUBSCRIBERS_EXPECTED = 10


def main():
    # Create a ZeroMQ context. This is like a container for sockets.
    # All sockets within a context can potentially talk to each other
    # efficiently (e.g., using in-process communication if needed).
    context = zmq.Context()

    # Create a PUB (Publisher) socket.
    # PUB sockets distribute data to all connected SUB sockets.
    publisher = context.socket(zmq.PUB)

    # Set the "Send High Water Mark" (SNDHWM).
    # This option puts a limit on the number of outgoing messages ZMQ will queue
    # in memory for a specific connection. Setting a high value helps ensure
    # that even if a subscriber is slow, the publisher won't drop messages
    # easily. It will queue them up instead (up to this limit).
    # Note: A value of 0 means no limit (can use lots of memory).
    publisher.sndhwm = 1100000

    # Bind the publisher socket to a TCP address and port.
    # Subscribers will connect to this address. '*' means listen on all
    # available network interfaces.
    publisher.bind("tcp://*:5561")

    # Create a REP (Reply) socket.
    # REP sockets are used for request-reply patterns. Here, we use it
    # to receive a "ready" signal from each subscriber.
    syncservice = context.socket(zmq.REP)

    # Bind the synchronization service socket to another TCP port.
    # Subscribers will connect here *first* to signal they are ready.
    syncservice.bind("tcp://*:5562")

    # Wait until the expected number of subscribers have connected and signaled.
    subscribers = 0
    print(f"Waiting for {SUBSCRIBERS_EXPECTED} subscribers to connect...")
    while subscribers < SUBSCRIBERS_EXPECTED:
        # Block and wait to receive *any* message from a subscriber
        # on the synchronization socket. The content doesn't matter.
        msg = syncservice.recv()

        # Send an empty reply back to the subscriber.
        # This confirms receipt of their signal and completes the REQ-REP cycle
        # for that subscriber.
        syncservice.send(b'')

        # Increment the count of connected subscribers.
        subscribers += 1
        print(f"Subscriber {subscribers}/{SUBSCRIBERS_EXPECTED} connected.")

    # All expected subscribers have signaled they are ready.
    # Start broadcasting the actual data.
    print("\nBroadcasting data...")
    for i in range(1000000):
        # Send a message via the publisher socket.
        # All connected subscribers will receive this message.
        publisher.send(b"Rhubarb")

    # Send a final message to indicate the end of the data stream.
    # Subscribers can use this to know when to stop listening.
    publisher.send(b"END")
    print("Finished broadcasting.")

    # Note: In a real application, you'd likely want to add cleanup
    # code (closing sockets and terminating the context) in a finally block
    # or using context managers, but this example keeps it simple.


if __name__ == "__main__":
    main()