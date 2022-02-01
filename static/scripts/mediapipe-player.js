import EventBus from './event-bus.js'
import MediaPipePose from './mediapipe-pose.js'
import { Timer } from '/utils/time.js'
import { loadJSON } from '/utils/file.js'
import StateMachine from "/scripts/state-machine.js"

const PlayerState = StateMachine.factory({
  initState: "idle",
  states: {
    idle: {
      startRecord: { to: "recording" },
      startPlayback: { to: "playing" },
    },

    playing: {
      stopPlayback: { to: "idle" }
    },

    recording: {
      stopRecord: { to: "idle" }
    }
  }
})

class MediaPipePlayer extends EventBus {

  constructor(params = {}) {

    super()

    const defaults = {
      frames: [],
      timer: new Timer(),
      status: new PlayerState(),
      timeDrift: 15, //! prevent frame drop issue
    }

    Object.assign(this, defaults, params)
    this.clearRecording()
    this.clearPlayback()

    this.currFrameIndex = 0
    this.status.on('startRecord', () => {
      this.timer.start()
    })
    this.status.on('stopRecord', () => {
      this.timer.stop()
    })
    this.status.on('startPlayback', () => { })
  }

  resumeRecord() {
    this.status.startRecord()
  }

  clearRecording() {
    this.skippedFrames = 0
    this.frames.length = 0
  }

  stopRecord() {
    if (!this.status.is('idle'))
      this.status.emit('stopRecord')
  }

  startRecord({ skipFrames = 0, bufferMaxDuration = Infinity } = {}) {
    this.clearRecording()

    this.skipFrames = skipFrames
    this.bufferMaxDuration = bufferMaxDuration

    this.status.emit('startRecord')
  }

  update(pose) {
    if (!this.status.is('recording')) return

    if (this.skippedFrames < this.skipFrames) {
      this.skippedFrames++
      return
    }

    this.skippedFrames = 0

    const { deltaTime, duration } = this.timer.tick()

    const newFrame = buildFrame(compress(pose), deltaTime)

    if (duration > this.bufferMaxDuration)
      this.frames.shift()

    this.frames.push(newFrame)
  }

  startPlayback({ loop = false } = {}) {
    if (this.frames.length === 0) return

    this.clearPlayback()
    this.loop = loop
    this.status.emit('startPlayback')
    this.updateFrame()
  }

  updateFrame() {
    let [pose, deltaTime] = this.frames[this.currFrameIndex]

    pose = decompress(pose)

    if (this.currFrameIndex === 0) deltaTime = 0

    const timeNow = performance.now()

    if (this.playbackTime + deltaTime > timeNow + this.timeDrift) { this.requestFrame(); return }

    super.triggerEventListener('playbackpose', { recordedSkeleton: pose })
    this.playbackTime = timeNow

    this.currFrameIndex = (this.currFrameIndex + 1) % this.frames.length

    if (this.currFrameIndex === 0 && !this.loop) {
      this.stopPlayback()
    } else {
      this.requestFrame()
    }
  }

  requestFrame() {
    this.animationFrame = requestAnimationFrame(this.updateFrame.bind(this))
  }

  stopPlayback() {

    cancelAnimationFrame(this.animationFrame)

    if (this.status.is('idle')) return

    this.status.emit('stopPlayback')
    super.triggerEventListener('playbackstop')
  }

  clearPlayback() {
    this.loop = false
    this.currFrameIndex = 0
  }

  getRecording() {
    return buildRecording({ frames: this.frames })
  }

  setRecording({ f: frames }) {
    this.frames = frames
  }

  is(state) {
    return this.status.is(state)
  }

  static async createFrom(fileURL) {
    const recording = await loadJSON(fileURL)
    const instance = new this()
    instance.setRecording(recording)
    return instance
  }
}

function buildFrame(pose, deltaTime) {
  return [pose, deltaTime]
}

function buildRecording({ frames }) {
  return { f: frames }
}

function compress(pose) {

  if (!pose) return null

  const compressedPose = new Array(MediaPipePose.LANDMARK_ENTRIES.length).fill(null)

  Object.entries(pose).forEach(([key, value]) => {
    const index = window.POSE_LANDMARKS[key]
    compressedPose[index] = [value.x, value.y, value.visibility]
  })

  return compressedPose
}

function decompress(compressedPose) {

  if (!compressedPose) return undefined

  const pose = {}

  MediaPipePose.LANDMARK_ENTRIES.forEach(([key, index]) => {
    const [x, y, z, visibility] = compressedPose[index]
    pose[key] = { x, y, z, visibility }
  })

  return pose
}

window.MediaPipePlayer = MediaPipePlayer

export default MediaPipePlayer