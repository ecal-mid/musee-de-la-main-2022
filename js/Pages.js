import { htmlEncode } from 'htmlencode'

export class Page {
  constructor(options = {}) {

    this.options = {
      ...options
    }

    this.div = document.createElement("div")
    document.querySelector(".swipe-wrap").appendChild(this.div)
    this.div.classList.add('page')

    this.dot = document.createElement("span")
    document.getElementById("navigation").appendChild(this.dot)

    this.constructor.pages.push(this)
  }
  select(active) {
    const { classList } = this.dot
    active ? classList.add("active") : classList.remove("active")
  }


  static select(index) {
    this.pages.forEach((page, i) => {
      page.select(index === i)
    })
  }
}
//! static class property
Page.pages = []

function encodeHTML(strings, ...keys) {
  return strings.map((string, index) => {
    const text = keys[index] || ''
    return string + htmlEncode(text)
  }).join('')
}

export class StudentPage extends Page {
  constructor({ project, options }) {
    super(options)

    const { title, students, description, interaction, images } = project

    this.div.classList.add('page--student')
    this.div.innerHTML = encodeHTML`
    <div class="imageWrapper">
      <img>
    </div>
    <div class="content">
        <h2 class="title glow">${title}</h2>
        <h3 class="students glow">${students.join(', ')}</h3>
        <p class="description">${description}</p>
        <p class="interaction">${interaction}</p>
    </div>`

    this.div.querySelector('.imageWrapper > img').src = images[0]
  }
}

export class HomePage extends Page {
  constructor({ home, options }) {
    super(options)

    const { title, footer } = home

    this.div.classList.add('page--home')
    this.div.innerHTML = encodeHTML`
      <h1 class="mainTitle glow">${title}</h1>
      <h3 class="hidden">_</h3>
      <footer class="glow">${footer}</footer>
    `
  }
}

export class AboutPage extends Page {
  constructor({ about, options }) {
    super(options)

    const { sections, title } = about

    this.div.classList.add('page--about')

    let innerHTML = ''

    innerHTML += encodeHTML`<h2 class="title glow">${title}</h2>`

    sections.forEach(({ title, text }) => {
      if (title) innerHTML += encodeHTML`<h3>${title}</h3>`
      if (text) innerHTML += encodeHTML`<p>${text}</p>`
    })

    innerHTML += encodeHTML`<div class="logo"></div>`

    this.div.innerHTML = innerHTML
  }
}
