const CALIB = {
  brushMin: 30,
  brushMax: 300,
  blurMin: 0,
  blurMax: 12,
}
const maxCaptures = 100

const skeleton = new Skeleton()
const smoother = new MediaPipeSmoothPose({
  lerpAmount: 0.33, // range [0-1], 0 is slowest
  dampAmount: 0, // range ~1-10 [0 is fastest]
})

const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe

const blendmode = "source-out" // source-out -> stroke inside is delayed, source-in -> outside is delayed
const captures = []
const videoCanvas = document.createElement('canvas')
const videoCtx = videoCanvas.getContext('2d')

let BlurLerp = 0
let nose
let maskLayer
let leftWrist, rightWrist

mediaPipe.addEventListener("setup", () => {

  const { width, height } = mediaPipe.video
  videoCanvas.width = width
  videoCanvas.height = height
})

mediaPipe.addEventListener("pose", (event) => {
  smoother.target(event.data.skeleton)
})

function setup() {
  createCanvas(windowWidth, windowHeight)
  pixelDensity(1)

  maskLayer = createGraphics(0, 0)
  windowResized()

  maskLayer.noFill()
  maskLayer.noStroke()

  maskLayer.strokeJoin(ROUND)

  const x = width / 2
  const y = height / 2

  leftWrist = new BrushStroke({ x, y, p5Graphics: maskLayer })
  rightWrist = new BrushStroke({ x, y, p5Graphics: maskLayer })

}

function transformMirror(ctx = drawingContext) {
  if (mediaPipe.mirrored) {
    ctx.scale(-1, 1)
    ctx.translate(-width, 0)
  }
}

function draw() {

  const { video } = mediaPipe

  if (video.readyState === 0) return

  resizeCanvas(video.width, video.height)
  background(255)
  updatePoints()

  updateWebcamBuffer()
  drawMaskLayer()

  // draw delayed capture
  push()

  if (captures.length > 0) {
    transformMirror()
    drawingContext.putImageData(captures[0], 0, 0)
  }

  pop()

  drawingContext.filter = `blur(${BlurLerp}px)`
  image(maskLayer, 0, 0)
  drawingContext.filter = "none"

  leftWrist.showDebug(false)
  rightWrist.showDebug(false)
}

function updatePoints() {
  const pose = smoother.smoothDamp() // or smoother.lerp()
  skeleton.update(pose)

  if (pose) {

    rightWrist.follow(pose.RIGHT_WRIST)
    leftWrist.follow(pose.LEFT_WRIST)

    const left = pose.LEFT_SHOULDER
    const right = pose.RIGHT_SHOULDER

    const distPerson = dist(left.x, left.y, right.x, right.y)

    let weight = map(distPerson, 0.01, 0.4, CALIB.brushMax, CALIB.brushMin)
    weight = max(CALIB.brushMin, weight)
    BlurLerp = map(distPerson, 0.01, 0.4, CALIB.blurMax, CALIB.blurMin)

    leftWrist.setWeight(weight)
    rightWrist.setWeight(weight)

  } else {
    leftWrist.setWeight(0)
    rightWrist.setWeight(0)
  }
}

function updateWebcamBuffer() {

  videoCtx.drawImage(mediaPipe.video, 0, 0)
  const pixels = videoCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height)

  while (captures.length > maxCaptures) {
    captures.shift()
  }

  captures.push(pixels)
}

function drawMaskLayer() {
  const ctx = maskLayer.drawingContext

  maskLayer.clear()

  maskLayer.push()
  // draw line

  // ctx.filter = `blur(${Math.max(BlurLerp, 0)}px)`
  leftWrist.draw()
  rightWrist.draw()

  maskLayer.endShape()

  ctx.filter = "none"

  ctx.globalCompositeOperation = blendmode

  transformMirror(ctx)

  ctx.drawImage(mediaPipe.video, 0, 0, width, height)

  ctx.globalCompositeOperation = "source-over"

  maskLayer.pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  maskLayer.resizeCanvas(width, height)
}