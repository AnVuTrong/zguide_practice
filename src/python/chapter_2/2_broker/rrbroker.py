# Simple request-reply broker
#
# Author: Lev Givon <lev(at)columbia(dot)edu>

import zmq

# Prepare our context and sockets
context = zmq.Context()
frontend = context.socket(zmq.ROUTER)
backend = context.socket(zmq.DEALER)
frontend.bind("tcp://*:5559")
backend.bind("tcp://*:5560")

# Initialize poll set
poller = zmq.Poller()
poller.register(frontend, zmq.POLLIN)
poller.register(backend, zmq.POLLIN)

# Switch messages between sockets
while True:
    socks = dict(poller.poll())

    if socks.get(frontend) == zmq.POLLIN:
        print("Received message from frontend")
        message = frontend.recv_multipart()
        print(f"Sending message to backend: {message}")
        backend.send_multipart(message)

    if socks.get(backend) == zmq.POLLIN:
        print("Received message from backend")
        message = backend.recv_multipart()
        print(f"Sending message to frontend: {message}")
        frontend.send_multipart(message)