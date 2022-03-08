export class Page {
  constructor(options = {}) {

    this.options = {
      ...options
    }

    this.div = document.createElement("div");
    document.querySelector(".swipe-wrap").appendChild(this.div);
    this.div.classList.add('page')

    this.dot = document.createElement("span");
    document.getElementById("navigation").appendChild(this.dot);

    this.constructor.pages.push(this)
  }
  select(active) {
    const { classList } = this.dot
    active ? classList.add("active") : classList.remove("active")
  }

  static pages = []
  static select(index) {
    this.pages.forEach((page, i) => {
      page.select(index === i)
    })
  }
}


export class StudentPage extends Page {
  constructor({ project, options }) {
    super(options)

    const { title, students, description, interaction, images } = project

    this.div.classList.add('page--student')
    this.div.innerHTML = `
    <div class="imageWrapper">
      <img>
    </div>
    <div class="content">
        <h2 class="title glow">${title}</h2>
        <h3 class="students glow">${students.join(', ')}</h3>
        <p class="description">${description}</p>
        <p class="interaction">${interaction}</p>
    </div>`;

    this.div.querySelector('.imageWrapper > img').src = images[0]
  }
}

export class HomePage extends Page {
  constructor({ home, options }) {
    super(options)

    const { title, footer } = home

    this.div.classList.add('page--home')
    this.div.innerHTML = `
      <h1 class="mainTitle glow">${title}</h1>
      <h3 class="hidden">_</h3>
      <footer class="glow">${footer}</footer>
    `;
  }
}
