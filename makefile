# Chapter 1: Request-Reply
ch1_req_rep_server:
	python src/python/chapter_1/1_req_rep/server.py

ch1_req_rep_client:
	python src/python/chapter_1/1_req_rep/client.py

# Chapter 1: Publish-Subscribe
ch1_pub_sub_server:
	python src/python/chapter_1/2_pub_sub/weather_server.py

ch1_pub_sub_client:
	python src/python/chapter_1/2_pub_sub/weather_client.py

# Chapter 1: Push-Pull (Pipeline)
ch1_push_pull_ventilator:
	python src/python/chapter_1/3_push_pull/ventilator.py

ch1_push_pull_worker:
	python src/python/chapter_1/3_push_pull/worker.py

ch1_push_pull_sink:
	python src/python/chapter_1/3_push_pull/sink.py

# Chapter 2: ZMQ Poll
ch2_zmq_poll:
	python src/python/chapter_2/1_zmq_poll/zmq_poll.py

# Chapter 2: Request-Reply Broker
ch2_broker_broker:
	python src/python/chapter_2/2_broker/rrbroker.py

ch2_broker_worker:
	python src/python/chapter_2/2_broker/rrworker.py

ch2_broker_client:
	python src/python/chapter_2/2_broker/rrclient.py

# Chapter 2: Proxy
ch2_proxy_msgqueue:
	python src/python/chapter_2/3_proxy/msgqueue.py

# Chapter 2: Bridge
ch2_bridge_proxy:
	python src/python/chapter_2/4_brigde/wuproxy.py

ch2_bridge_client:
	python src/python/chapter_2/4_brigde/weather_client.py # Note: Uses weather server from ch1

# Chapter 2: Kill Signal
ch2_kill_sink:
	python src/python/chapter_2/5_kill_signal/task_sink2.py

ch2_kill_worker:
	python src/python/chapter_2/5_kill_signal/task_worker2.py

# Chapter 2: SIGTERM Handling
ch2_sigterm:
	python src/python/chapter_2/6_sigterm/ctrl_c.py

# Chapter 2: Multithreading
ch2_mt_server:
	python src/python/chapter_2/7_multithreading/mtserver.py

ch2_mt_relay:
	python src/python/chapter_2/7_multithreading/mtrelay.py

# Chapter 2: Node Coordination (Synchronized Publisher)
ch2_sub_sync:
	python src/python/chapter_2/8_node_cordination/sub_synchronization.py

ch2_pub_sync:
	python src/python/chapter_2/8_node_cordination/pub_synchronization.py
