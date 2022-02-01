const canvas = document.querySelector('.main-canvas')
const ctx = canvas.getContext('2d')

const skeleton = new Skeleton()
const smoother = new MediaPipeSmoothPose({
    lerpAmount: 0.33, // range [0-1], 0 is slowest
    dampAmount: 0.1, // range ~1-10 [0 is fastest]
});

const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe // global object mediaPipe

mediaPipe.addEventListener('setup', () => {
    canvas.width = mediaPipe.video.width
    canvas.height = mediaPipe.video.height
    requestUpdate()
})

mediaPipe.addEventListener('pose', (event) => {
    smoother.target(event.data.skeleton)
})

function requestUpdate() {
    requestAnimationFrame(update)
}

function update() {
    const { width, height } = canvas

    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(mediaPipe.video, 0, 0, width, height)

    const pose = smoother.smoothDamp() // or smoother.lerp()

    skeleton.update(pose)
    skeleton.show(ctx, { color: 'red' })

    ctx.translate(width / 2, height / 2)
    ctx.scale(0.5, 0.5)

    ctx.restore()

    requestUpdate()
}
