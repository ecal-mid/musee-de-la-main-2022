import Swipe from "swipejs";
import Socket from "./Socket";
import StudentPage from "./StudentPage";
import Utils from "./Utils";

export default class App {
  constructor() {
    this.isFullscreen = false;
    this.debug = document.getElementById("debug");
    this.handlers = {
      callback: this.onTransitionEnd.bind(this),
      message: this.onMessage.bind(this),
    };
    this.setup();
  }
  async setup() {
    await this.buildPages();

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
    this.updateNavigation(index);
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

  updateNavigation(index) {
    console.log(index);
    Array.from(document.getElementById("navigation").children).forEach(
      (dot, i) => {
        if (i == index) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      }
    );
  }
  buildPages() {
    return new Promise((resolve, reject) => {
      fetch("/json/studentProjects.json")
        .then((data) => data.json())
        .then((json) => {
          json.projects.forEach((data, i) => {
            new StudentPage(data);
            const dot = document.createElement("span");
            // dot.classList.add("material-icons-outlined");
            // dot.textContent = "radio_button_unchecked";
            if (i == 0) {
              dot.classList.add("active");
            }
            document.getElementById("navigation").appendChild(dot);
          });
          // refresh allImages
          Array.from(document.getElementsByClassName("imageWrapper")).forEach(
            (image) => {
              console.log(image);
              image.style.backgroundImage = `url(${image.getAttribute(
                "data-image"
              )})`;
            }
          );
          resolve();
        });
    });
  }
}
