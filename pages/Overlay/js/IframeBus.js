import EventBus from '~/js/event-bus.js'
import Deferred from 'promise-deferred'

export default class IframeBus extends EventBus {
    constructor({ transitionDelay }) {
        super()
        this.handlers = {
            'changeproject': this.onChangeProject.bind(this)
        }

        this.parent = window.parent

        window.addEventListener("message", (e) => {
            this.handlers[e.data.message]?.(e)
        })

        this.transitionDelay = transitionDelay
    }

    onChangeProject(e) {

        this.emit('resume')

        console.log("just swiped, please fade in", e)
        console.log(":: project ID ::", e.data.id)

        const isProject = e.data.id >= 0
        console.log(e.data)
        clearTimeout(this.timeout)

        if (!isProject) {
            this.emit('title')
            return
        } else {
            
            this.emit('project', e.data.project)
        }

        this.timeout = setTimeout(() => {
            this.message("overlayended", {})
        }, this.transitionDelay)

    }

    message(message, data = {}) {
        this.parent.postMessage({ message, ...data }, "*")
    }

    waitFor(eventName) {
        const deferred = new Deferred()
        this.addEventListener(eventName, (event) => deferred.resolve(event))
        return deferred.promise
    }
}