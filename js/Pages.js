import { htmlEncode } from 'htmlencode'

export class Page {
  constructor(options = {}) {

    this.options = {
      ...options
    }

    this.div = document.createElement("div")
    document.querySelector(".swipe-wrap").appendChild(this.div)
    this.div.classList.add('page')

    this.dot = document.createElement("div")
    document.querySelector("#navigation > .nav__buttons").appendChild(this.dot)

    this.constructor.pages.push(this)
  }

  select(active) {

    [this.dot, this.div].forEach(({ classList }) => {
      active ? classList.add("active") : classList.remove("active")
    })

  }

  static navigation(callback) {
    const buttons = document.querySelector("#navigation > .nav__buttons")
    buttons.onclick = (event) => {
      const index = [...buttons.children].indexOf(event.target)
      if (index >= 0) callback(index)
    }
  }

  static prev(callback) {
    const button = document.querySelector("#navigation > .nav__left")
    button.onclick = callback
  }

  static next(callback) {
    const button = document.querySelector("#navigation > .nav__right")
    button.onclick = callback
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

function joinList(arr, { repeat = ', ', last = ' & ' } = {}) {
  let str = ''
  arr.forEach((elem, index, arr) => {
    if (index === 0) {
      str += elem
    } else if (index === arr.length - 1) {
      str += last + elem
    } else {
      str += repeat + elem
    }
  })
  return str
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
        <h3 class="students glow">${joinList(students)}</h3>
        <p class="description">${description}</p>
        <p class="interaction">${interaction}</p>
    </div>`

    this.div.querySelector('.imageWrapper > img').src = images[0]
  }
}

export class HomePage extends Page {
  constructor({ home, options }) {
    super(options)

    const { title, instruction } = home

    this.div.classList.add('page--home')
    this.div.innerHTML = encodeHTML`
      <h1 class="mainTitle glow">${title}
        <svg class="svg-title">
          <text
            fill="transparent"
            x="50%" y="100%"
            text-anchor="middle"
            stroke-width="1"
            alignement-baseline="central"
            vector-effect="non-scaling-stroke"
            font-size="100%"
          >${title}</text>
        </svg>
      </h1>
      <span class="instruction glow">${instruction}</span>
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
