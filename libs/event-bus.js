
import { removeElementFromArray } from '/utils/object.js'

//TODO options object

export default class EventBus {
    constructor() {
        this.listeners = new Map()
    }

    addEventListener(eventName, callback, options) {
        const listeners = this.listeners.get(eventName) || this.createEventListenerGroup(eventName)
        listeners.push(callback)
    }

    createEventListenerGroup(eventName) {
        const group = emptyGroup();
        this.listeners.set(eventName, group);
        return group;
    }

    triggerEventListener(eventName, data) {
        const listeners = this.listeners.get(eventName) || emptyGroup()
        const event = new EventData(data)
        for (const callback of listeners) {
            callback(event)
        }
    }

    removeEventListener(eventName, callback, options) {
        const listeners = this.listeners.get(eventName) || emptyGroup()
        const removed = false
        listeners && removeElementFromArray(listeners, callback)
        return removed
    }
}

function emptyGroup() {
    return []
}

class EventData {
    constructor(data) {
        this.data = data
    }
}