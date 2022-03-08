
import { clamp, lerp, mapClamped } from '../../utils/math'

export const types = {
  FAIL: { type: 'fail', text: 'fail' },
  WARN: { type: 'warn', text: 'warning' },
  INFO: { type: 'success', text: 'success' },
  NORMAL: { type: 'normal', text: '' }
}

export class Message {
  constructor(options) {

    this.params = {
      parent: null,
      lifeSpan: 10000,
      fadeDuration: 1000,
      type: types.NORMAL,
      created: performance.now(),
      ...options
    }

    this.elem = this.create()

    this.setLabel(this.params.type)

    this.params.parent.appendChild(this.elem)
    this.requestDestroy = false
  }

  update(time) {

    const { lifeSpan, created, fadeDuration } = this.params

    const span = created + lifeSpan

    const alpha = mapClamped(time, span, span + fadeDuration, 1, 0)
    this.elem.style.opacity = alpha

      ;[...this.elem.children].forEach(child => TextStyle.update(child))

    this.requestDestroy = span + fadeDuration < time
  }

  create() {
    const elem = document.createElement('div')
    elem.classList.add('fakeConsole__message')
    return elem
  }

  destroy() {
    this.elem.remove()
  }

  setLabel({ type, text }) {

    const options = { className: [`label--${type}`, 'label'], textContent: text }

    const elem = this.elem.querySelector('.label')

    if (!elem) this.push(TextStyle.generate(options))
    else TextStyle.update(elem, options)
  }

  push(elem) {
    this.elem.appendChild(elem)
  }
}

export class TextStyle {
  static generate(options) {
    const elem = document.createElement('span')

    this.update(elem, options)
    // this.setAttributes(elem, { dataset: { text: options.textContent } })

    return elem
  }

  static update(elem, options = {}) {
    this.setAttributes(elem, options)
  }

  static setAttributes(elem, options) {
    Object.entries(options).forEach(([name, value]) => {
      if (Array.isArray(value)) value = value.join(' ')
      if (typeof value === 'object') return this.setAttributes(elem[name], value)
      elem[name] = value
    })
  }
}