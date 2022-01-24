
import { removeElementFromArray } from '/utils/object.js'

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
        const event = new EventData(data)
        const responses = []
        for (const callback of listeners) {
            const resp = callback(event)
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
        if (listeners.length > 0)
            removed = removeElementFromArray(listeners, callback)
        if (listeners.length === 0) this.listeners.delete(eventName)
        return removed
    }
}

function getListeners(listeners, eventName) {
    return listeners.get(eventName)
}

function createGroup(listeners, eventName) {
    const group = emptyGroup();
    listeners.set(eventName, group);
    return group;
}

function emptyGroup() {
    return []
}

class EventData {
    constructor(data) {
        this.data = data
    }
}