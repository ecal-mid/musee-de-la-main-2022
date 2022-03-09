import EventEmitter from "@onemorestudio/eventemitterjs"

/**
 *  IP ADDRESS TO BE CHANGED
 */

export default class Socket extends EventEmitter {
  constructor() {
    super()
    this.handlers = {
      open: this.onOpenWSConnection.bind(this),
      error: this.onWSError.bind(this),
      message: this.onWSMessage.bind(this),
    }
    this.checkWebsocketAvailibility()
  }
  checkWebsocketAvailibility() {
    window.WebSocket = window.WebSocket || window.MozWebSocket
    // si le navigateur n'accepte pas les websocket
    if (!window.WebSocket) {
      alert("Il faut utiliser un autre navigateur. Chrome par exemple.")
    } else {
      this.initConnection()
    }
  }
  initConnection() {
    this.connection = new WebSocket(`ws://${window.location.host}`)
    // on ouvre la connection
    this.connection.onopen = this.handlers.open
    this.connection.onerror = this.handlers.error
    this.connection.onmessage = this.handlers.message
  }
  onOpenWSConnection(e) {
    console.log("::open connection::", e)
  }
  onWSError(error) {
    console.log("::error::", error)
  }
  sendMessage(msg) {
    this.connection.send(msg)
  }
  onWSMessage(message) {
    console.log("::message::", message)
    this.emit("message", [JSON.parse(message.data)])
  }
}
