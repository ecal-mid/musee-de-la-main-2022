import EventBus from "/libs/event-bus.js"

export default class Posenet extends EventBus {

    constructor() {
        super()
        // this.bus = new EventBus()
    }

    async init({ videoElem, mirrored }) {

        if (mirrored)
            videoElem.classList.add('--mirrored')

        this.posenet = await new Promise(resolve => {
            const posenet = window.ml5.poseNet(videoElem, { flipHorizontal: mirrored },
                () => {
                    console.log(`Model loaded`)
                    resolve(posenet)
                }
            )
        })

        this.videoElem = videoElem
        this.posenet.on("pose", this.onPoses.bind(this))
    }

    onPoses(results) {
        const [firstResult] = results
        const { width, height } = this.videoElem

        if (firstResult)
            super.triggerEventListener('pose', { firstResult, width, height })
    }
}