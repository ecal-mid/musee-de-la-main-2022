import Skeleton from '/libs/skeleton.js'

const canvas = document.querySelector('.main-canvas')
const video = document.querySelector('.video-webcam')
const ctx = canvas.getContext('2d')

const skeleton = new Skeleton();

window.init = ({ stream, width, height, pose }) => {
    video.srcObject = stream

    video.width = width
    video.height = height
    canvas.width = video.width
    canvas.height = video.height

    video.muted = true //! video must be muted for autoplay

    video.play()
    requestUpdate()

    pose.addEventListener('pose', onPose)
}

function onPose(event) {
    skeleton.update(event.data.skeleton)
}

function requestUpdate() {
    requestAnimationFrame(update)
}

function update() {
    ctx.save()
    ctx.clearRect(canvas.width, canvas.height, 0, 0)
    ctx.drawImage(video, 0, 0)


    skeleton.show(ctx)

    ctx.restore()

    requestUpdate()
}
