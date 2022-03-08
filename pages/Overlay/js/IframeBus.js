import EventEmitter from '@onemorestudio/eventemitterjs'
import Deferred from 'promise-deferred'

export default class IframeBus extends EventEmitter {
    constructor() {
        super()
        this.handlers = {
            'changeproject': this.onChangeProject.bind(this)
        }

        this.parent = window.parent

        window.addEventListener("message", (e) => {
            this.handlers[e.data.message]?.(e)
        });
    }

    onChangeProject(e) {

        super.emit('resume')

        console.log("just swiped, please fade in", e);
        console.log(":: project ID ::", e.data.id);

        const isProject = e.data.id >= 0
        clearTimeout(this.timeout)

        if (!isProject) return

        this.timeout = setTimeout(() => {
            this.message("overlayended", {});
        }, 2500);

    }

    message(message, data = {}) {
        this.parent.postMessage({ message, ...data }, "*");
    }

    waitFor(eventName) {
        const deferred = new Deferred();
        super.addEventListener(eventName, (event) => deferred.resolve(event))
        return deferred.promise
    }
}