const canvas = document.querySelector('.main-canvas')
const ctx = canvas.getContext('2d')

const skeleton = new Skeleton()
const normalSkeleton = new Skeleton()

const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe // global object mediaPipe

mediaPipe.addEventListener('setup', () => {
    canvas.width = mediaPipe.video.width
    canvas.height = mediaPipe.video.height
    requestUpdate()
})

mediaPipe.addEventListener('pose', (event) => {
    skeleton.update(event.data.skeleton)
    normalSkeleton.update(event.data.skeletonNormalized)
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


    ctx.translate(width / 2, height / 2)
    ctx.scale(0.5, 0.5)
    normalSkeleton.show(ctx, { color: '#00ff00' })

    ctx.restore()

    requestUpdate()
}
