const PICTURE_COUNTDOWN = 2
const STORAGE_LIMIT = 200

const TAU = 2 * Math.PI

const storage = new Storage({
  path: "melanie",
  origin: "http://localhost:1080",
})

class App {
  constructor() { }
  init({ canvas, video, mirrored = false }) {
    // this.video_wrapper = document.getElementById("video");
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")
    this.mirrored = mirrored

    this.smoother = new MediaPipeSmoothPose({
      dampAmount: 0.1, // range ~1-10 [0 is fastest]
    })

    // console.dir(this.video);
    this.video = video
    // const { innerWidth, innerHeight } = window;

    // this.video.width = innerWidth;
    // this.video.height = innerHeight;
    const { width, height } = video
    const thickness = 50
    this.canvas.width = width
    this.canvas.height = height

    // this.video_wrapper.appendChild(this.video);
    // this.video_wrapper.appendChild(this.canvas);

    this.frameCount = 0
    this.circles = []
    this.texts = []
    this.dataURLs = []
    this.cachedPictures = {}
    this.poses = []
    // this.mediaPipe = new MediaPipeClient()
    // this.loadPoseNetModel();
    // this.loadFaceDetection();
    this.initMatter()
    //



    this.floor = new Ground(this.MATTER, 0, height, width, thickness)
    this.leftWall = new Ground(this.MATTER, -thickness, height / 2, thickness, height / 2)
    this.rightWall = new Ground(this.MATTER, width, height / 2, thickness, height / 2)

    this.initListeners()

    this.isReadyFace = false
    this.detectionOptions = {
      withLandmarks: true,
      withDescriptors: false,
    }
    this.faceDetections
    this.detectFaces = []
    this.counter = 0
    this.cheese = 0
    this.currentImageIndex = 0
    this.info
    this.picIndex
    this.faceDetectionDuration = 0
    this.noDetectionDuration = 0
    this.changeState(PICTURE_COUNTDOWN)


    // const audioCtx = new AudioContext()
    this.cameraSound = new Audio("./sound/camera_sound.mp3")

    this.bubbleSounds = [
      "./sound/bubble_3.mp3",
      "./sound/bubble_1.mp3",
      "./sound/bubble_2.mp3",
    ].map(path => {
      const audio = new Audio(path)
      audio.volume = 0.05
      return audio
    })

    // audioCtx.resume().then(() => {
    //   const source = audioCtx.createMediaElementSource(this.audio)
    //   source.connect(audioCtx.destination)
    // }).catch(e => console.log(e))

    this.isReady = true
  }
  onKeydown(e) {
    // this.getPicture();
    // console.log(e.key);
    switch (e.key) {
      case "Enter":
        this.clearCircles()
        break
    }
  }

  //firebase
  initListeners() {
    document.addEventListener("keydown", this.onKeydown.bind(this))

    // this.getInfoPicture = firebase
    //   .database()
    //   .ref("PICTURES-GESTS/PICTURES-STORAGE/");
    // this.getInfoPicture.on("value", (snapshot) => {
    //   // const data = snapshot.val()
    //   this.dataURLs = Object.values(snapshot.val());
    // });

    storage
      .list("images")
      .then((list) => {
        if (!Array.isArray(list)) return

        this.dataURLs = list.map((item) => {
          return item.url
        })

        //console.log(this.dataURLs)
        // console.log(this.dataURLs);
      })
      .catch((e) => { })

    // console.log(b);
  }

  initMatter() {
    this.MATTER = {
      Engine: Matter.Engine,
      Render: Matter.Render,
      World: Matter.World,
      Body: Matter.Body,
      Bodies: Matter.Bodies,
      engine: Matter.Engine.create(),
    }
    // this.floor = new Ground();
    // this.floor.groundLimit(this.MATTER);
  }

  // loadPoseNetModel() {
  //   this.poseNet = ml5.poseNet(this.video, this.modelLoaded.bind(this));
  // }
  // modelLoaded() {
  //   console.log("model loaded");
  //   // this.isReady = true;
  //   this.draw();
  //   this.poseNet.on("pose", (results) => {
  // if (!this.person && results && results[0])
  //   this.person = new Person(results[0].pose.keypoints, this.MATTER);
  // this.poses = results;
  //   if (this.person == 1 && results && results[1])
  //   this.person2 = new Person(results[1].pose.keypoints, this.MATTER);
  // this.poses = results;
  //   });
  // }

  onPose(pose) {
    this.smoother.target(pose)

    if (!this.person && pose) {
      const { width, height } = this.canvas
      this.person = new Person({ pose, MATTER: this.MATTER, width, height })
      this.person.update(pose)
    }

    this.poses.length = 0 //? clear array
    if (pose) this.poses.push(pose)
  }

  getFaceBounds(pose) {
    let { RIGHT_EAR, LEFT_EAR, NOSE } = pose
    RIGHT_EAR = this.toScreen(RIGHT_EAR)
    LEFT_EAR = this.toScreen(LEFT_EAR)
    const center = this.toScreen(NOSE)
    const w = Math.hypot(RIGHT_EAR.x - LEFT_EAR.x, RIGHT_EAR.y - LEFT_EAR.y) * 1.8
    const x = center.x - w / 2
    const y = center.y - w / 1.5

    return { x, y, w, center }
  }

  async takeAndSendFace() {

    const [pose] = this.poses
    if (!pose) return

    const { x, y, w } = this.getFaceBounds(pose)

    const picIndex = Date.now()

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = w
    canvas.height = w

    if (this.mirrored) {
      ctx.scale(-1, 1)
      ctx.translate(-w, 0)
    }

    ctx.drawImage(this.video, x, y, w, w, 0, 0, w, w)

    const imageString = canvas.toDataURL("image/jpeg", 0.8)
    // console.log(imageString);
    const image = new Image()
    image.src = imageString
    image.addEventListener('load', async () => {
      image.onload = null
      const path = await storage.upload(`images/${picIndex}.jpg`, image)
      this.dataURLs.push(path)

      while (this.dataURLs.length > STORAGE_LIMIT) {
        const firstElem = this.dataURLs.shift()
        await storage.delete(firstElem)
      }
    }, { once: true })
    // SEND_MESSAGE("PICTURES-GESTS/PICTURES-STORAGE/" + picIndex, imageString);

    // console.log(this.dataURLs);
  }

  drawFaceDetection(completion /* 0 to 1 */) {
    const [pose] = this.poses
    if (!pose) return

    const { center, w } = this.getFaceBounds(pose)
    const { ctx } = this
    const radius = w * 0.5

    ctx.save()

    if (this.mirrored) {
      ctx.scale(-1, 1)
      ctx.translate(-this.canvas.width, 0)
    }

    ctx.translate(center.x, center.y)
    ctx.rotate(-Math.PI / 2)

    ctx.lineWidth = 3
    ctx.lineCap = 'round'

    // black circle
    ctx.beginPath()
    ctx.strokeStyle = 'black'
    ctx.arc(0, 0, radius, 0, TAU, false)
    ctx.stroke()

    // completion circle
    ctx.beginPath()

    ctx.lineWidth++
    ctx.strokeStyle = 'white'
    ctx.arc(0, 0, radius, 0, completion * TAU, false)
    ctx.stroke()

    ctx.restore()

  }

  drawFlash(completion) {
    const [pose] = this.poses
    if (!pose || completion > 1) return

    const { center, w } = this.getFaceBounds(pose)
    const { ctx } = this
    const radius = w * 0.5

    ctx.save()

    if (this.mirrored) {
      ctx.scale(-1, 1)
      ctx.translate(-this.canvas.width, 0)
    }

    ctx.translate(center.x, center.y)

    // flash circle
    ctx.beginPath()
    ctx.globalAlpha = 1 - completion
    ctx.fillStyle = 'white'
    ctx.arc(0, 0, radius, 0, TAU, false)
    ctx.fill()

    ctx.restore()
  }
  // --------------------------------------------------
  rainBubbles() {
    if (this.isReady && this.frameCount % 12 == 0) {
      const size = randomRange(20, 60)

      this.circles.push(
        new Circle(
          Math.random() * this.canvas.width,
          -size * 2,
          size,
          null,
          this.MATTER
        )
      )
      this.frameCount = 0
    }
  }

  async previousImage() {
    if (this.dataURLs.length === 0) throw new Error("list empty")
    // this.imageToDisplay
    this.currentImageIndex = trueModulo(
      this.currentImageIndex - 1,
      this.dataURLs.length
    )

    // console.log(this.currentImageIndex);
    const src = this.dataURLs[this.currentImageIndex]
    let image = this.cachedPictures[src]

    if (!image) {
      image = await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = src
      })

      this.cachedPictures[src] = image
    }

    return image
  }

  drawBubbles() {
    // DRAW
    //! navigate through array in reverse, to delete circles while drawing
    for (let i = this.circles.length - 1; i >= 0; i--) {
      const posXBall = this.circles[i].body.position.x
      const posYBall = this.circles[i].body.position.y
      const radius = this.circles[i].body.circleRadius
      //   let colorBall = this.circles[i].c;
      //   if (posYBall > 50) {
      //     colorBall = "#F00000";
      //   }

      if (
        this.person &&
        Matter.Collision.collides(
          this.circles[i].body,
          this.person.boundaries[NOSE].body
        )
      ) {
        // console.log("HEAD TOUCHED");
        this.circles[i].c = "black"
        // this.circles[i].img = this.img

        if (!this.circles[i].img) {


          this.previousImage()
            .then((img) => {
              randomArrayElement(this.bubbleSounds).play()
              this.circles[i].addImage(img)
            })
            .catch((e) => {
              randomArrayElement(this.bubbleSounds).play()
              // console.log("no image found!")
            })
        }
      }

      this.circles[i].show(this.ctx)

      if (posYBall > this.canvas.height + 70) {
        let index = i
        this.circles[i].removeFromWorld()
        this.circles.splice(index, 1)
      }

    }
  }

  checkIfThereIsSomeone() {
    if (this.poses.length === 0) {
      this.faceDetectionDuration = 0
      return
    }
    this.faceDetectionDuration++
  }

  changeState(newState) {
    this.state = newState

    switch (this.state) {
      case PICTURE_COUNTDOWN:
        {
          this.clearPersonPhysic()
          this.clearCircles() //? wtf il en reste 29
          // this.floor = new Ground();
          // this.floor.groundLimit(this.MATTER, this.canvas.width, this.canvas.height);

          // this.texts.forEach((text) => text.removeFromWorld(this.MATTER));
          // this.texts.length = 0;
        }
        break

      case 3:
        {
          // this.detectFaces.forEach((face) => {
          this.takeAndSendFace(this.person.boundaries[NOSE])

          this.cameraSound.play()


          // });
          // this.floor = new Ground();
          // this.floor.groundLimit(this.MATTER);
          //facedetection duration = 0
        }
        break
    }
  }

  draw() {
    this.ctx.fillStyle = "lightgrey"

    const smoothedPose = this.smoother.smoothDamp()
    const { width, height } = this.canvas

    this.ctx.save()

    if (this.mirrored) {
      this.ctx.scale(-1, 1)
      this.ctx.translate(-width, 0)
    }

    this.ctx.drawImage(this.video, 0, 0, width, height)
    this.ctx.restore()

    this.MATTER.Engine.update(this.MATTER.engine) //! was in a state before
    // console.log(this.MATTER.engine.world.bodies.length);



    switch (this.state) {
      case PICTURE_COUNTDOWN:
        this.rainBubbles()
        this.drawBubbles()
        this.checkIfThereIsSomeone()

        const duration = 200

        this.drawFaceDetection(this.faceDetectionDuration / duration)

        if (this.faceDetectionDuration >= duration) {
          this.faceDetectionDuration = 0
          this.flashDuration = 0
          this.changeState(3)
        }

        break
      case 3:
        // console.log("STATE3");
        this.rainBubbles()
        this.drawBubbles()
        const flashDuration = 4
        this.drawFlash((this.flashDuration++) / flashDuration)
        //person

        if (this.person) {
          this.person.update(smoothedPose)
          // this.person.show(this.ctx);
        }

        if (this.poses.length === 0) {
          this.counter++

          if (this.counter >= 100) {
            console.log("NOBODY")
            this.clearCircles()
            this.clearPersonPhysic()
            this.changeState(PICTURE_COUNTDOWN)
          }
        } else {
          this.counter = 0
        }
        // if (this.person) {
        //   if (this.poses.length > 0) {
        //     this.counter = 0;
        //     this.person.update(smoothedPose);
        //   }

        //   this.person.show(this.ctx);

        //   if (this.poses.length <= 0) {
        //     this.counter++;
        //     if (this.counter >= 200) {
        //       console.log("NOBODY")
        //       this.clearCircles();
        //       this.clearPersonPhysic();
        //       this.counter = 0;
        //       this.changeState(PICTURE_COUNTDOWN);
        //     }
        //   }
        // }

        break
    }

    // this.MATTER.Engine.update(this.MATTER.engine); //! was in a state before
    this.frameCount++

    // this.floor.show()

    //
    const { ctx } = this

    requestAnimationFrame(this.draw.bind(this))
    // requestAnimationFrame(() => this.draw());
  }

  toScreen(landmark) {
    const { width, height } = this.canvas

    let { x, y } = landmark

    if (this.mirrored)
      x = 1 - x

    return {
      x: x * width,
      y: y * height
    }
  }

  clearCircles() {
    this.circles.forEach((item) => item.removeFromWorld())
    this.circles.length = 0
  }
  clearGroundPhysic() {
    this.floor.removeFromWorld(this.MATTER)
  }
  clearPersonPhysic() {
    if (this.person) {
      this.person.destroy()
      this.person = null
    }
  }
}


const mediaPipe = new MediaPipeClient()
window.mediaPipe = mediaPipe // global object mediaPipe

const app = new App()

mediaPipe.addEventListener("setup", () => {
  const video = mediaPipe.video
  const canvas = document.querySelector(".main-canvas")

  app.init({ canvas, video, mirrored: mediaPipe.mirrored })
  app.draw()

  mediaPipe.addEventListener("pose", (event) => {
    app.onPose(event.data.skeleton)
  })
})
