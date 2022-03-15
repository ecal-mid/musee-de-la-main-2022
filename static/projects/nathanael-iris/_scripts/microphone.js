class Microphone {
    constructor() {
        window.microphone = this
        this.mic = null
    }

    plugIn(microphone) {
        console.info('%c Using iframe microphone', 'background: rgba(0, 255, 0, 0.1); color: lime')
        this.mic = microphone
    }

    get() {

        if (!this.mic) {

            if (!(window.p5 && window.p5.AudioIn)) {
                console.error('please install p5.js and p5.sound.js to have the microphone!')
                return
            }

            this.mic = new p5.AudioIn();
            this.mic.start();

            console.info('%c Using local microphone', 'background: rgba(255, 0, 0, 0.1); color: red')
        }

        return this.mic
    }
}