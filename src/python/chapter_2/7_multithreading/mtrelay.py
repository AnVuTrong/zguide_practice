"""

   Multithreaded relay

   Author: Guillaume Aubert (gaubert) <guillaume(dot)aubert(at)gmail(dot)com>

"""

import threading
import zmq


def step1(context: zmq.Context = None):
    """Step 1"""
    context = context or zmq.Context.instance()
    # Signal downstream to step 2
    sender = context.socket(zmq.PAIR)
    sender.connect("inproc://step2")
    print("Step 1 sending signal")
    sender.send(b"")
    print("Step 1 sent signal")


def step2(context: zmq.Context = None):
    """Step 2"""
    context = context or zmq.Context.instance()
    # Bind to inproc: endpoint, then start upstream thread
    receiver = context.socket(zmq.PAIR)
    receiver.bind("inproc://step2")

    thread = threading.Thread(target=step1)
    thread.start()

    # Wait for signal
    msg = receiver.recv()
    print("Step 2 received signal")
    # Signal downstream to step 3
    sender = context.socket(zmq.PAIR)
    sender.connect("inproc://step3")
    sender.send(b"")
    print("Step 2 sent signal")


def main():
    """ server routine """
    # Prepare our context and sockets
    context = zmq.Context.instance()

    # Bind to inproc: endpoint, then start upstream thread
    receiver = context.socket(zmq.PAIR)
    receiver.bind("inproc://step3")
    print("Step 3 bound to inproc://step3")
    thread = threading.Thread(target=step2)
    thread.start()
    print("Step 3 started thread")
    # Wait for signal
    string = receiver.recv()
    print("Step 3 received signal")
    print("Test successful!")

    receiver.close()
    context.term()


if __name__ == "__main__":
    main()