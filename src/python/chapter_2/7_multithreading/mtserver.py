"""

   Multithreaded Hello World server

   Author: Guillaume Aubert (gaubert) <guillaume(dot)aubert(at)gmail(dot)com>

"""
import time
import threading
import zmq


def worker_routine(worker_url: str,
                   context: zmq.Context = None):
    """Worker routine"""
    context = context or zmq.Context.instance()
    # Socket to talk to dispatcher
    socket = context.socket(zmq.REP)
    socket.connect(worker_url)
    print(f"Worker {worker_url} started")

    while True:
        string = socket.recv()
        print(f"Received request: [ {string} ]")

        # Do some 'work'
        time.sleep(1)

        # Send reply back to client
        socket.send(b"World")


def main():
    """Server routine"""

    url_worker = "inproc://workers"
    url_client = "tcp://*:5555"

    # Prepare our context and sockets
    context = zmq.Context.instance()

    # Socket to talk to clients
    clients = context.socket(zmq.ROUTER)
    clients.bind(url_client)

    # Socket to talk to workers
    workers = context.socket(zmq.DEALER)
    workers.bind(url_worker)
    print(f"Server started at {url_client}")
    # Launch pool of worker threads
    for i in range(5):
        thread = threading.Thread(target=worker_routine, args=(url_worker,))
        thread.daemon = True
        thread.start()

    zmq.proxy(clients, workers)

    # We never get here but clean up anyhow
    print("Server shutting down")
    clients.close()
    workers.close()
    context.term()


if __name__ == "__main__":
    main()