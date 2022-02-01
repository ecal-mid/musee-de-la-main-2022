import EventBus from './event-bus.js'

// https://gist.github.com/livoras/9d995948b412e4c22776

/**
 * @param {Object} settings
 *                 - {String} current
 *                 - {Object} states
 *                 - {Object} actions
 * @constructor
 */
class StateMachine extends EventBus {

  #current

  constructor(settings) {
    super()
    this.#current = settings.initState || ''
    this.actions = settings.actions || []
    this.states = settings.states || {}
  }

  emit(eventName) {

    let state = this.states[this.#current]
    let transition = state[eventName]
    if (!transition) {
      throw new Error(`"${eventName}" not possible when in state "${this.#current}"`)
    }
    let oldState = this.#current
    let newState = transition.to
    this.#current = newState
    transition.actions?.forEach((fnName) => {
      this.actions[fnName].call(this, oldState, newState)
    })

    super.emit(eventName)
  }

  get state() {
    return this.#current
  }

  is(state) {
    return this.#current === state
  }

  static factory(settings) {
    return this.bind(this, settings)
  }
}

export default StateMachine