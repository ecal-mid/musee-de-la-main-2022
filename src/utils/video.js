import EventBus from '/scripts/event-bus.js'

export async function getWebcamStream({ width, height, constraints = {} } = {}) {
    const video = document.createElement('video')
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, ...constraints })

    return new Promise(resolve => {
        video.onloadedmetadata = () => {

            // video.play()
            video.muted = true
            video.width = width || video.videoWidth
            video.height = height || video.videoHeight
            resolve({ stream, width: video.width, height: video.height, video })
        }

        video.srcObject = stream
    })
}

export class VideoPlayer extends EventBus {

    constructor(options = {}) {

        super()

        this.width
        this.height
        this.stream
        this.video

        Object.assign(this, options)

        this.lastTime = -1;
        this.animationFrame = null;

    }

    play() {
        this.seekFrame()
        this.video.play()
    }

    stop() {
        //TODO
    }

    async seekFrame() {
        const { currentTime } = this.video;
        if (currentTime !== this.lastTime) {
            await super.triggerEventListenerAsync('frame', this)
            this.lastTime = currentTime;
        }

        this.animationFrame = window.requestAnimationFrame(this.seekFrame.bind(this))
    }

    static async getStream(webcamStreamOptions) {
        const { video, width, height, stream } = await getWebcamStream(webcamStreamOptions)
        // console.log(this)
        return new this({ video, width, height, stream })
    }


    // window.requestAnimationFrame(draw);
}