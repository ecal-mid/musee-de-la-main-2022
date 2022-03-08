
import { clamp, lerp, mapClamped } from '../../utils/math'
import EventBus from '../../utils/event-bus.js'

export default class Text extends EventBus {

  static state = {
    ALIVE: 'alive',
    FADEOUT: 'fadeout',
    DESTROY: 'destroy'
  }

  constructor(options) {
    super()
    this.params = {
      lifeSpan: Infinity,
      fadeDuration: 1000,
      text: '',
      attributes: {},
      ...options
    }

    this.triggerTime = this.oldTime = performance.now()
    this.setState(this.constructor.state.ALIVE)
    this.elem = document.createElement('span')

    const textContent = this.params.text
    if (textContent) {
      this.text = new Text({ attributes: { textContent } })
      this.push(this.text)
    }
    this.setAttributes(this.params.attributes)
  }

  update(time = performance.now()) {

    const { state } = this.constructor

    switch (this.state) {
      case state.ALIVE:

        this.waitState(state.FADEOUT, time)

        break
      case state.FADEOUT:
        const opacity = 1 - this.stateCompletion(time)
        this.setAttributes({ style: { opacity } })
        this.waitState(state.DESTROY, time)
        break
    }
  }

  stateCompletion(time = performance.now()) {
    const { triggerTime, oldTime } = this
    return mapClamped(time, oldTime, triggerTime, 0, 1)
  }

  waitState(state, time) {
    if (this.triggerTime < time) this.setState(state)
  }

  is(state) {
    return this.state === state
  }

  setState(newState) {
    this.state = newState
    super.emit('stateChange', this.state)
    const { lifeSpan, fadeDuration } = this.params
    const { state } = this.constructor
    this.oldTime = this.triggerTime

    switch (this.state) {
      case state.ALIVE:
        this.triggerTime += lifeSpan
        break
      case state.FADEOUT:
        this.triggerTime += fadeDuration
        break
      case state.DESTROY:
        this.destroy()
    }
  }

  destroy() {
    this.elem.remove()
    super.emit('destroy', this)
  }

  isDead(time) {
    const { created, lifeSpan } = this.params
    return created + lifeSpan < time
  }

  push(...textInstances) {
    textInstances.forEach(textInstance => this.elem.append(textInstance.elem))
  }

  unshift(...textInstances) {
    textInstances.reverse().forEach(textInstance => this.elem.prepend(textInstance.elem))
  }

  setAttributes(options, elem = this.elem) {
    Object.entries(options).forEach(([name, value]) => {
      const prop = elem[name]

      if (prop instanceof CSSStyleDeclaration) return this.setAttributes(value, prop)
      else if (prop instanceof DOMTokenList) prop.add(value)
      else if (prop instanceof DOMStringMap) return this.setAttributes(value, prop)
      else elem[name] = value
      //   elem.add(value)
      // } else elem[name] = value
    })
  }
}