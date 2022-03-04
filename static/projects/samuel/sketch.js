const MIRRORED = false;

const skeleton = new Skeleton();
const smoother = new MediaPipeSmoothPose({
  lerpAmount: 0.33, // range [0-1], 0 is slowest
  dampAmount: 0, // range ~1-10 [0 is fastest]
});
const mediaPipe = new MediaPipeClient();
window.mediaPipe = mediaPipe;
let poseNet;
let skeletons = [];
let pose;
let poses = [];

let lerpBlur;
let pg;
let droitX;
let droitY;
let leftX;
let leftY;

let d;
let x2;
let BlurLerp = 0;
let finalValueX;
let finalValueY;

let lerpX = 0;
let lerpY = 0;
let nose;

let blendmode = "source-out";

let pNoseX;
let pNoseY;

let maskLayer;
let eraserSize = 1.2; //? scale value
let blurSize = 1.2; //? blur Value
let closing = 100;

const captures = [];
const maxCaptures = closing;

let leftWrist, rightWrist;

let jambeGauche;
let videoCanvas = document.createElement('canvas')
let videoCtx = videoCanvas.getContext('2d')

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  maskLayer = createGraphics(0, 0);
  windowResized();

  // maskLayer.scale(-1, 1);
  // maskLayer.translate(-width, 0);
  // maskLayer.stroke("red");

  maskLayer.noFill();
  maskLayer.noStroke();

  maskLayer.strokeJoin(ROUND);

  // fullWidthCapture = createCapture(VIDEO);
  // fullWidthCapture.size(640, 480);

  // poseNet = ml5.poseNet(fullWidthCapture, modelReady);
  // poseNet.on("pose", function (results) {
  //   results.forEach(({ pose }) => {
  //     //! remap pose coordinates to canvas coordinates
  //     Object.entries(pose).forEach(([key, value]) => {
  //       //! filter pose properties (remove score and keypoints)
  //       if (!(typeof value === "object" && "x" in value)) return;

  //       const { x, y } = remapCamPosToCanvas(value.x, value.y);
  //       value.x = x;
  //       value.y = y;
  //     });
  // video = createVideo();

  mediaPipe.addEventListener("setup", () => {

    const { width, height } = mediaPipe.video
    videoCanvas.width = width
    videoCanvas.height = height
    resizeCanvas(width, height);
    // mediaPipe.mirrored = true
  });

  mediaPipe.addEventListener("pose", (event) => {
    smoother.target(event.data.skeleton);
  });
  //   });

  //   poses = results;
  // });

  // fullWidthCapture.hide();

  leftWrist = new BrushStroke({ p5Graphics: maskLayer });
  rightWrist = new BrushStroke({ p5Graphics: maskLayer });

  jambeGauche = new BrushStroke({ p5Graphics: maskLayer });
}

function draw() {

  if (mediaPipe.video.readyState === 0) return;

  background(255);
  updatePoints();
  // console.log("up");
  updateWebcamBuffer();
  drawMaskLayer();

  // draw delayed capture
  push();
  // if (MIRRORED) {
  //   translate(width, 0);
  //   scale(-1, 1);
  // }

  if (captures.length > 0) {

    if (mediaPipe.mirrored) {
      translate(width, 0);
      scale(-1, 1);
    }

    drawingContext.putImageData(captures[0], 0, 0)
    // image(captures[0], 0, 0, width, height);
  }

  drawSkeleton();
  pop();

  drawingContext.filter = "blur(" + BlurLerp + "px)";
  image(maskLayer, 0, 0);
  drawingContext.filter = "none";

  leftWrist.showDebug();
  rightWrist.showDebug();
}
function updatePoints() {
  const pose = smoother.smoothDamp(); // or smoother.lerp()
  skeleton.update(pose);

  if (pose) {
    // console.log(pose.LEFT_WRIST.x * width, pose.LEFT_WRIST.y * height);
    // console.log(pose.RIGHT_ANKLE.x * width, pose.RIGHT_ANKLE.y * height);
    // console.log(pose.RIGHT_ANKLE);
    rightWrist.follow(pose.RIGHT_WRIST);
    leftWrist.follow(pose.LEFT_WRIST);
    let EpauleGaucheX = pose.LEFT_SHOULDER.x * width;
    let EpauleGaucheY = pose.LEFT_SHOULDER.y * height;

    let EpauleDroiteX = pose.RIGHT_SHOULDER.x * width;
    let EpauleDroiteY = pose.RIGHT_SHOULDER.x * width;

    // console.log(pose.LEFT_WRIST.x * width, pose.LEFT_WRIST.y * height);

    // console.log(pose.RIGHT_WRIST.x * width, pose.RIGHT_WRIST.y * height);
    // jambeGauche.follow(pose.leftAnkle);

    // console.log(leftX, leftY);

    // let EpauleGauche = pose.leftShoulder;
    // let EpauleDroite = pose.rightShoulder;

    d = dist(EpauleGaucheX, EpauleGaucheY, EpauleDroiteX, EpauleDroiteY);

    // const weight = map(d, 240, 55, 180, 40) * eraserSize; BEFORE
    const weight = map(d, 280, 70, 150, 50) * eraserSize;

    // lerpBlur = map(d, 200, 50, 3, 0) * blurSize; BEFORE
    lerpBlur = map(d, 200, 50, 0, 22.5) * blurSize;
    closing = map(d, 50, 130, 100, 0);
    BlurLerp = lerp(BlurLerp, lerpBlur, 0.07) / 1.2;

    // console.log(d, closing);

    if (d < 85) {
      const nul = 0;

      leftWrist.setWeight(nul);
      rightWrist.setWeight(nul);

      jambeGauche.setWeight(nul);

      console.log("trig", nul);

      // console.log(weight);
    } else {
      leftWrist.setWeight(weight);
      rightWrist.setWeight(weight);

      jambeGauche.setWeight(weight);
    }
  }
}

function drawSkeleton() {
  // Loop through all the skeletons detected
  // for (let i = 0; i < poses.length; i++) {
  //   // For every skeleton, loop through all body connections
  //   for (let j = 0; j < poses[i].skeleton.length; j++) {
  //     let partA = poses[i].skeleton[j][0];
  //     let partB = poses[i].skeleton[j][1];
  //     stroke(255, 0, 0);
  //     line(
  //       partA.position.x,
  //       partA.position.y,
  //       partB.position.x,
  //       partB.position.y
  //     );
  //   }
  // }
}
// function gotPoses(results) {
//   poses = results;
//   // console.log(poses);

//   if (poses.length > 0) {
//     pose = poses[0].pose;
//   }
// }

function updateWebcamBuffer() {

  videoCtx.drawImage(mediaPipe.video, 0, 0)
  const pixels = videoCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height)

  while (captures.length > maxCaptures) {
    captures.shift()
  }

  captures.push(pixels);
}

function drawMaskLayer() {
  const ctx = maskLayer.drawingContext;

  maskLayer.clear();

  maskLayer.push();
  // draw line

  // let point = points[0];
  // point && ctx.moveTo(point.x, point.y);

  ctx.filter = `blur(${BlurLerp / 10}px)`;
  leftWrist.draw();
  rightWrist.draw();

  // jambeGauche.draw();

  maskLayer.endShape();

  ctx.filter = "none";

  ctx.globalCompositeOperation = blendmode;

  // if (MIRRORED) {
  //   maskLayer.scale(-1, 1);
  //   maskLayer.translate(-width, 0);
  // }

  if (mediaPipe.mirrored) {
    maskLayer.scale(-1, 1);
    maskLayer.translate(-width, 0);
  }

  maskLayer.drawingContext.drawImage(mediaPipe.video, 0, 0, width, height);

  ctx.globalCompositeOperation = "source-over";

  maskLayer.pop();
}

function remapCamPosToCanvas(camX, camY) {
  let w1 = 0;
  let w2 = width;

  // if (MIRRORED) {
  //   w1 = width;
  //   w2 = 0;
  // }

  const { video } = mediaPipe

  const x = map(camX, 0, video.width, w1, w2);
  const y = map(camY, 0, video.height, 0, height);
  return { x, y };
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    blendmode = "source-out";
    console.log("source-out");
  } else if (keyCode === RIGHT_ARROW) {
    blendmode = "source-in";
    console.log("source-in");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maskLayer.resizeCanvas(width, height);
}

// image.src = "13.jpeg";
// setTimeout(() => {
//   $("#image").css("display", "none");
// }, 2000);
