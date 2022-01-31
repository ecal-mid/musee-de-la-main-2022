import Socket from "~/libs/Socket.js";
import {loadJSON} from "~/utils/file.js";

export default class IFrame {
  constructor() {
    console.log("iFrame is ok");
    this.handlers = {
      message: this.onMessage.bind(this),
      load: this.onIFrameLoaded.bind(this),
    };
    this.frame = document.getElementById("frame");
    this.frame.addEventListener("load", this.handlers.load);
    this.socket = new Socket();
    this.socket.addEventListener("message", this.handlers.message);
    this.initData();
  }

  async initData() {
    this.studentsData = await loadJSON("./json/studentProjects.json");
  }
  onIFrameLoaded(e) {
    console.log("::iframe loaded::", e);
  }
  onMessage(data) {
    if ("project_id" in data) {
      const id = parseInt(data["project_id"]);
      const url = this.studentsData.projects[id].url;
      this.frame.src = url + `?_v=${new Date().getTime()}`;
    }
  }
}
