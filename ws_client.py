import websocket

ws = websocket.WebSocket()
ws.connect("ws://192.168.1.178:8080")

def websocket_send(msg):
  ws.send(msg)