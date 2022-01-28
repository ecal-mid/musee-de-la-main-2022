const canvas = document.querySelector('.main-canvas')
const ctx = canvas.getContext('2d')
const recordBtn = document.querySelector('#Record-btn')

const skeleton = new Skeleton()
let recorder = new MediaPipePlayer()

const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe // global object mediaPipe


recordBtn.onclick = () => {
    if (recorder.is('recording')) {
        
        recorder.stopRecord()
        recordBtn.classList.remove('--recording')

        console.log('Record DATA: ', recorder.getRecording()); //? get recording -> can save it to JSON
        // recorder.setRecording() //? set recording <- from a parsed JSON
        
        recorder.startPlayback({ loop: true })
    } else {
        
        recorder.stopPlayback()

        recorder.startRecord()
        recordBtn.classList.add('--recording')

    }
}

mediaPipe.addEventListener('setup', async () => {
    canvas.width = mediaPipe.video.width
    canvas.height = mediaPipe.video.height

    recorder.addEventListener('playbackpose', (event) => {
        skeleton.update(event.data.recordedSkeleton) //? control skeleton if playback
    })

    recorder.addEventListener('playbackstop', () => {})

    requestUpdate()
})


mediaPipe.addEventListener('pose', (event) => {

    recorder.update(event.data.skeleton)  //? update recorder

    if (recorder.is('playing')) return

    skeleton.update(event.data.skeleton) //? control skeleton otherwise
})

function requestUpdate() {
    requestAnimationFrame(update)
}

function update() {
    const { width, height } = canvas

    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(mediaPipe.video, 0, 0, width, height)

    skeleton.show(ctx, { color: 'red' })

    ctx.restore()

    requestUpdate()
}
