//TODO options object

export default class EventBus {
  constructor() {
    this.listeners = new Map()
  }

  addEventListener(eventName, callback, options) {
    const listeners = getListeners(this.listeners, eventName) || createGroup(this.listeners, eventName)
    listeners.push(callback)
  }

  triggerEventListener(eventName, data) {
    const listeners = getListeners(this.listeners, eventName) || emptyGroup()
    const responses = []
    for (const callback of listeners) {
      const resp = callback(data)
      // if(resp instanceof Promise)
      responses.push(resp)
    }

    return responses
  }


  async triggerEventListenerAsync(eventName, data) {
    await Promise.all(this.triggerEventListener(eventName, data))
  }

  removeEventListener(eventName, callback, options) {

    const listeners = getListeners(this.listeners, eventName) || emptyGroup()

    let removed = false
    if (listeners.length > 0) {
      removed = deleteFromArray(listeners, callback)
    }
    if (listeners.length === 0) this.listeners.delete(eventName)

    return removed
  }
}

EventBus.prototype.on = EventBus.prototype.addEventListener
EventBus.prototype.off = EventBus.prototype.removeEventListener
EventBus.prototype.emit = EventBus.prototype.triggerEventListener

function getListeners(listeners, eventName) {
  return listeners.get(eventName)
}

function createGroup(listeners, eventName) {
  const group = emptyGroup()
  listeners.set(eventName, group)
  return group
}

function emptyGroup() {
  return []
}

function deleteFromArray(arr, elem) {
  const index = arr.indexOf(elem)
  if (index >= 0) arr.splice(index, 1)
}