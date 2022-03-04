import Socket from "./Socket";
import Utils from "./Utils";

export default class IFrame {
  constructor() {
    console.log("iFrame is ok");
    this.handlers = {
      message: this.onMessage.bind(this),
      load: this.onIFrameLoaded.bind(this),
      iFrameMessage: this.onIFrameMessage.bind(this),
    };
    this.overlay = document.getElementById("overlay");
    this.frame = document.getElementById("frame");
    this.frame.src = frame.src; // force iframe reload
    this.frame.addEventListener("load", this.handlers.load);
    this.socket = new Socket();
    this.socket.addEventListener("message", this.handlers.message);
    window.addEventListener("message", this.handlers.iFrameMessage);
    this.initData();
  }

  async initData() {
    this.studentsData = await Utils.loadJSON("/json/studentProjects.json");
  }
  onIFrameLoaded(e) {
    console.log("::iframe loaded::", e);
    this.onFrameLoad(e);
  }
  // message from ipad
  onMessage(data) {
    if ("project_id" in data) {
      const id = parseInt(data["project_id"]);
      const url = this.studentsData.projects[id].url;
      // wait for transition before updating the frame
      setTimeout(() => {
        this.frame.src = url + `?_v=${new Date().getTime()}`;
      }, 1000);
      // fadein the overlay
      this.overlay.classList.remove("hide");
      // send info to iFrame
      this.overlay.contentWindow.postMessage(
        { message: "changeporject", id: id },
        "*"
      );
    }
  }
  // message from overlay
  onIFrameMessage(e) {
    if (e.data.message == "overlayready") {
      this.overlay.classList.add("hide");
    }
  }
  // overwritten
  onFrameLoad(event) {}
}
