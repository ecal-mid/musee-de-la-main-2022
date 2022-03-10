import "~/styles/controller.scss"
import App from "~/js/AppDom"

window.onload = () => {
  new App()

  // document.body.ontouchstart = () => alert(document.body.requestFullscreen)
  // const { origin, pathname } = window.location

  // const timeNow = Date.now()
  // const { searchParams } = new URL(window.location.href)
  // const oldThreshold = 3 * 1000
  // const isTooOld = parseInt(searchParams.get('version')) + oldThreshold < timeNow

  // if (navigator.standalone && (isTooOld)) {
  //   document.location.href = `${origin + pathname}?version=${timeNow}`
  // }
}