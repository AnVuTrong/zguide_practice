#
#   Request-reply service in Python
#   Connects REP socket to tcp://localhost:5560
#   Expects "Hello" from client, replies with "World"
#
import zmq
import time

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.connect("tcp://localhost:5560")

while True:
    message = socket.recv()
    time_received = time.time()
    print(f"Received request: {message} at {time_received}")
    current_time = time.time()
    time.sleep(1)
    message_string = f"World at {current_time}"
    message_bytes = message_string.encode('utf-8')
    socket.send(message_bytes)