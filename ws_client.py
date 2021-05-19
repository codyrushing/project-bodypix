import websocket

ws = websocket.WebSocket()

def websocket_send(msg):
  try:
    ws.send(msg)
  except:
    websocket_connect()

def websocket_connect():
  try:
    ws.connect("ws://192.168.1.178:8080")
  except:
    pass

websocket_connect()