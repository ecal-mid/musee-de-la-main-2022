import Swipe from "swipejs"
import Socket from "./Socket"
import { HomePage, StudentPage, Page, AboutPage } from "./Pages"
import Utils from "./Utils"

const WAIT_DURATION = 5 * 60 * 1000 // millis

export default class App {
  constructor() {
    this.isFullscreen = false
    this.debug = document.getElementById("debug")
    this.handlers = {
      callback: this.onTransitionEnd.bind(this),
      message: this.onMessage.bind(this),
    }
    this.setup()
  }
  async setup() {
    const data = await Utils.loadJSON("/json/studentProjects.json")
    this.buildPages(data)
    Page.select(0)

    window.mySwipe = new Swipe(document.getElementById("slider"), {
      stopPropagation: true,
      transitionEnd: this.handlers.callback,
      callback: (pos, index, dir) => {
        // console.log(pos, index, dir)
      },
      dragStart: () => {
        clearTimeout(this.restartTimeout)
        // console.log('lol')
      }
    })

    this.socket = new Socket()
    this.socket.addEventListener("message", this.handlers.message)
    this.initListeners()
  }

  initiateRestart() {
    const waitMS = WAIT_DURATION
    clearTimeout(this.restartTimeout)
    this.restartTimeout = setTimeout(() => window.mySwipe.slide(0), waitMS)
  }

  onTransitionEnd(index, elem, dir) {

    // this.initiateRestart()

    this.debug.innerHTML = `${index},${elem},${dir}`
    const project_id = index - 1 //! -1 due to homepage
    this.socket.connection.send(
      JSON.stringify({ project_id, sender: this.ID })
    )
    this.updateNavigation(index)
  }
  onMessage(data) {
    if ("client_id" in data) this.ID = data["client_id"]

    if (data.type === 'nobody') {
      window.mySwipe.slide(0)
      return
    }
    //
    this.debug.innerHTML = ""
    const keys = Object.keys(data)
    keys.forEach((key) => {
      this.debug.innerHTML += `${key}: ${data[key]}<br/>`
    })
  }
  initListeners() { }

  updateNavigation(index) {
    Page.select(index)
  }
  buildPages(data) {


    const { projects, home, about } = data

    new HomePage({ home })

    projects.forEach((project, i) => {
      new StudentPage({ project })
    })

    new AboutPage({ about })

    // refresh allImages
    // Array.from(document.getElementsByClassName("imageWrapper")).forEach(
    //   (image) => {
    //     console.log(image);
    //     image.style.backgroundImage = `url(${image.getAttribute(
    //       "data-image"
    //     )})`;
    //   }
    // );
  }
}
