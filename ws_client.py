# import websocket

# ws = websocket.WebSocket()

# def websocket_send(msg):
#   try:
#     ws.send(msg)
#   except:
#     websocket_connect()

# def websocket_connect():
#   try:
#     ws.connect("ws://192.168.1.178:8080")
#   except:
#     pass

# websocket_connect()

# Alternate version that uses threads, but is somehow way slower
# https://github.com/websocket-client/websocket-client/issues/580
import websocket
import threading, time
ws = None
def on_close():
  global ws
  print('disconnected from server')
  print ("Retry : %s" % time.ctime())
  connect_websocket() # retry per 10 seconds
def on_open(ws):
  print('connection established')
def on_error(error):
  print('error')
  print(error)
  connect_websocket()
def connect_websocket():
  global ws
  print('connect_websocket')
  ws = websocket.WebSocketApp(
    "ws://192.168.1.178:8080", 
    on_error=on_error, 
    on_open=on_open, 
    on_close=on_close
  )
  wst = threading.Thread(target=ws.run_forever)
  wst.daemon = True
  wst.start()

connect_websocket()
def websocket_send(msg):
  ws.send(msg)
