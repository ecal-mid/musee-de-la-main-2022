const skeleton = new Skeleton()
const normalSkeleton = new Skeleton()
const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe

let video

function setup() {

    createCanvas(100, 100)
    pixelDensity(1)

    video = createVideo()

    mediaPipe.addEventListener('setup', () => {
        const videoElem = mediaPipe.video
        video = new p5.MediaElement(videoElem)
        resizeCanvas(videoElem.width, videoElem.height)
    })

    mediaPipe.addEventListener('pose', (event) => {
        const { data } = event
        skeleton.update(data.skeleton)
        normalSkeleton.update(data.skeletonNormalized)
    })
}

function draw() {

    clear()

    image(video, 0, 0)

    skeleton.show(drawingContext, { color: 'red' })

    translate(width / 2, height / 2)
    scale(0.5)

    normalSkeleton.show(drawingContext, { color: 'lime' })
}