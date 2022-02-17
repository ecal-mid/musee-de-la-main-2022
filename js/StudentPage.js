export default class StudentPage {
  constructor(data) {
    const div = document.createElement("div");
    div.className = "studentPage";
    div.innerHTML = `<div class="imageWrapper" data-image="${
      data.images[0]
    }"></div>
    <div class="content">
        <h1 class="title glow">${data.title}</h1>
        <h3 class="students glow">${[...data.students]
          .toString()
          .replace(",", ", ")}</h3>
        <p class="description">${data.description}</p>
    </div>`;

    document.querySelector(".swipe-wrap").appendChild(div);
  }
}
