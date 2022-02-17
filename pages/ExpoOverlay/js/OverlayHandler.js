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
      setTimeout(() => {
        parent.postMessage({ message: "overlayready" }, "*");
      }, 3000);
    });
  }
}

window.onload = () => {
  new OverlayHandler();
};
