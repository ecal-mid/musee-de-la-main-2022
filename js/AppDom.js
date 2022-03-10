import Swipe from "./swipe.custom.js"
import Socket from "./Socket"
import { HomePage, StudentPage, Page, AboutPage } from "./Pages"
import Utils from "./Utils"

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
    setTimeout(() => Page.select(0))

    window.mySwipe = new Swipe(document.getElementById("slider"), {
      stopPropagation: true,
      transitionEnd: this.handlers.callback,
      callback: (index, elem, dir) => {
        Page.select(index)
      },
      // dragStart: () => {},
    })

    Page.navigation(window.mySwipe.slide)
    Page.next(window.mySwipe.next)
    Page.prev(window.mySwipe.prev)

    this.socket = new Socket()
    this.socket.addEventListener("message", this.handlers.message)
  }

  onTransitionEnd(index, elem, dir) {

    this.debug.innerHTML = `${index},${elem},${dir}`
    const project_id = index - 1 //! -1 due to homepage
    this.socket.connection.send(
      JSON.stringify({ project_id, sender: this.ID })
    )
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

  buildPages(data) {


    const { projects, home, about } = data

    new HomePage({ home })

    projects.forEach((project, i) => {
      new StudentPage({ project })
    })

    new AboutPage({ about })
  }
}