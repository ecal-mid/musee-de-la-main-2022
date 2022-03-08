const MIRRORED = false

const skeleton = new Skeleton()
const smoother = new MediaPipeSmoothPose({
  lerpAmount: 0.33, // range [0-1], 0 is slowest
  dampAmount: 0, // range ~1-10 [0 is fastest]
})
const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe
let poseNet
let skeletons = []
let pose
let poses = []

let lerpBlur
let pg
let droitX
let droitY
let leftX
let leftY

let x2
let BlurLerp = 0
let finalValueX
let finalValueY

let lerpX = 0
let lerpY = 0
let nose

let blendmode = "source-out"

let pNoseX
let pNoseY

let maskLayer
let = 1.2 //? blur Value
let closing = 100

const captures = []
const maxCaptures = closing

let leftWrist, rightWrist

let jambeGauche
let videoCanvas = document.createElement('canvas')
let videoCtx = videoCanvas.getContext('2d')

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

  // jambeGauche = new BrushStroke({ p5Graphics: maskLayer })
}

function draw() {

  const vid = mediaPipe.video

  if (vid.readyState === 0) return

  resizeCanvas(vid.width, vid.height)
  background(255)
  updatePoints()

  // console.log("up");
  updateWebcamBuffer()
  drawMaskLayer()

  // draw delayed capture
  push()

  if (captures.length > 0) {

    if (mediaPipe.mirrored) {
      translate(width, 0)
      scale(-1, 1)
    }

    drawingContext.putImageData(captures[0], 0, 0)
  }

  pop()

  drawingContext.filter = "blur(" + BlurLerp + "px)"
  image(maskLayer, 0, 0)
  drawingContext.filter = "none"

  leftWrist.showDebug()
  rightWrist.showDebug()
}

const CALIB = {
  brushMin: 30,
  brushMax: 300,
  blurMin: 0,
  blurMax: 12,
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

    // const weight = map(d, 240, 55, 180, 40) * eraserSize; BEFORE
    let weight = map(distPerson, 0.01, 0.4, CALIB.brushMax, CALIB.brushMin)
    // weight = 10
    weight = max(CALIB.brushMin, weight)
    // console.log(distPerson)
    // lerpBlur = map(d, 200, 50, 3, 0) * ; BEFORE
    // lerpBlur = map(d, 200, 50, 0, 22.5) * blurSize
    BlurLerp = map(distPerson, 0.01, 0.4, CALIB.blurMax, CALIB.blurMin)


    // console.log(d, closing);

    // if (d < 85) {
    //   const nul = 0

    //   leftWrist.setWeight(nul)
    //   rightWrist.setWeight(nul)

    //   // jambeGauche.setWeight(nul)

    //   // console.log("trig", nul);

    //   // console.log(weight);
    // } else {
    leftWrist.setWeight(weight)
    rightWrist.setWeight(weight)

    // jambeGauche.setWeight(weight)
    // }
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

  ctx.filter = `blur(${Math.max(BlurLerp, 0)}px)`
  leftWrist.draw()
  rightWrist.draw()

  maskLayer.endShape()

  ctx.filter = "none"

  ctx.globalCompositeOperation = blendmode

  if (mediaPipe.mirrored) {
    maskLayer.scale(-1, 1)
    maskLayer.translate(-width, 0)
  }

  maskLayer.drawingContext.drawImage(mediaPipe.video, 0, 0, width, height)

  ctx.globalCompositeOperation = "source-over"

  maskLayer.pop()
}

function remapCamPosToCanvas(camX, camY) {
  let w1 = 0
  let w2 = width


  const { video } = mediaPipe

  const x = map(camX, 0, video.width, w1, w2)
  const y = map(camY, 0, video.height, 0, height)
  return { x, y }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    blendmode = "source-out"
    console.log("source-out")
  } else if (keyCode === RIGHT_ARROW) {
    blendmode = "source-in"
    console.log("source-in")
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  maskLayer.resizeCanvas(width, height)
}