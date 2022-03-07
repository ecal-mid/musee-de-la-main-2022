export default class OverlayHandler {
  constructor() {
    /**
     *
     *  FANCY LOGIC HERE
     *
     */
    window.addEventListener("message", (e) => {
      // console.log("just swiped, please fade in", e);
      console.log(e.data.message);
      console.log(":: project ID ::", e.data.id);
      // SEND MESSAGE BACK TO MAIN

      const isProject = e.data.id >= 0
      clearTimeout(this.timeout)

      if (isProject) {
        this.timeout = setTimeout(() => {
          parent.postMessage({ message: "overlayended" }, "*");
        }, 3000);
      }
    });
  }
}

window.onload = () => {
  new OverlayHandler();
};
