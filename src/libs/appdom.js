import Swipe from "swipejs";
import Socket from "./Socket";

export default class App {
  constructor() {
    this.isFullscreen = false;
    this.debug = document.getElementById("debug");
    this.handlers = {
      callback: this.onTransitionEnd.bind(this),
      message: this.onMessage.bind(this),
    };
    window.mySwipe = new Swipe(document.getElementById("slider"), {
      stopPropagation: true,
      transitionEnd: this.handlers.callback,
    });
    this.socket = new Socket();
    this.socket.addEventListener("message", this.handlers.message);
    this.initListeners();
  }
  onTransitionEnd(index, elem, dir) {
    this.debug.innerHTML = `${index},${elem},${dir}`;
    this.socket.connection.send(
      JSON.stringify({ project_id: index, sender: this.ID })
    );
  }
  onMessage(data) {
    if ("client_id" in data) this.ID = data["client_id"];
    //
    this.debug.innerHTML = "";
    const keys = Object.keys(data);
    keys.forEach((key) => {
      this.debug.innerHTML += `${key}: ${data[key]}<br/>`;
    });
  }
  initListeners() {}
}
