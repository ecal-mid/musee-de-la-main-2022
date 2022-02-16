import "~/styles/style.scss";
import App from "~/js/AppDom";
import { delay } from "~/static/utils/time.js"
import Utils from "~/js/Utils"

window.onload = () => {
  new App();

  // Utils.loadJSON("/json/studentProjects.json").then(({ projects }) => {

  //   const container = document.querySelector('#slider > .swipe-wrap')

  //   projects.forEach((project) => {
  //     const elem = document.createElement('div')
  //     elem.textContent = project.title
  //     container.appendChild(elem)
  //   });
  // })


};
