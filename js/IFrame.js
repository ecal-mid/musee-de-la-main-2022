import Socket from "./Socket"
import Utils from "./Utils"

export default class IFrame {
  constructor() {
    console.log("iFrame is ok")
    this.handlers = {
      message: this.onMessage.bind(this),
      load: this.onIFrameLoaded.bind(this),
      iFrameMessage: this.onIFrameMessage.bind(this),
    }
    this.overlay = document.getElementById("overlay")
    this.projectId = null

    this.overlay.addEventListener('transitionend', (event) => {
      // console.log(event);
      if (this.overlay.classList.contains('hide') && this.projectId === 1) this.overlay.src = this.overlay.src //! refresh overlay when hidden
    })

    this.frame = document.getElementById("frame")
    this.frame.src = frame.src // force iframe reload
    this.frame.addEventListener("load", this.handlers.load)
    this.socket = new Socket()
    this.socket.addEventListener("message", this.handlers.message)
    window.addEventListener("message", this.handlers.iFrameMessage)
    this.initData()
  }

  sendMessage(msg) {
    this.socket.connection.send(
      JSON.stringify({ ...msg, sender: this.ID })
    )
  }

  async initData() {
    this.studentsData = await Utils.loadJSON("/json/studentProjects.json")
  }
  onIFrameLoaded(e) {
    // this.frame.classList.remove('hide')
    console.log("::iframe loaded::", e)
    this.onFrameLoad(e)
  }

  messageOverlay(type, data = {}) {
    this.overlay.contentWindow.postMessage({ ...data, message: type }, "*")
  }

  // message from ipad
  onMessage(data) {

    // console.log('yes')

    if ("client_id" in data) this.ID = data["client_id"]

    if (!("project_id" in data)) return

    const { projects } = this.studentsData

    let id = parseInt(data["project_id"])
    let url

    const project = projects[id]

    if (project) {
      url = `${project.url}?_v=${Date.now()}`
    } else {
      id = -1
      url = ''
    }

    // wait for transition before updating the frame

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.frame.src = url
    }, 1000)
    // fadein the overlay
    setTimeout(() => {
      this.overlay.classList.remove("hide")
      this.frame.classList.add('hide')
    })
    // send info to iFrame

    this.projectId = id

    this.messageOverlay("changeproject", { id, project })

  }
  // message from overlay
  onIFrameMessage(e) {
    if (e.data.message === "overlayended") {
      // this.overlay.classList.add("hide")
      this.frame.classList.remove('hide')
      // this.overlay.src = this.overlay.src
    }
  }
  // overwritten
  onFrameLoad(event) { }
}
