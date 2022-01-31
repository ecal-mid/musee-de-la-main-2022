import MediaPipePose from '/scripts/mediapipe-pose.js'
import { smoothDamp, lerp } from "/utils/math.js"
import { deepCloneObject } from "/utils/object.js"
import { Timer } from "/utils/time.js"

const { LANDMARK_ENTRIES, LANDMARK_KEYS } = MediaPipePose

class MediaPipeSmoothPose {
  /**
   * @param {Object} [params={}]
   * @param {number} [params.lerpAmount=0.33] // range [0-1], 0 is slowest, used by lerp()
   * @param {number} [params.dampAmount=0.1] // range ~1-10 [0 is fastest], used by smoothDamp()
   * @param {number} [params.dampMaxSpeed=Infinity]
   */
  constructor(params = {}) {

    this.configure(params)

    this.landmarks = this.constructor.createLandmarks()
    this.smoothedLandmarks = null
    this.velocities = new WeakMap()
    this.timer = new Timer()
    // this.timer.start()

    this.isVisible = false
  }

  configure(params) {
    this.params = {
      lerpAmount: 0.33, //? 0 to 1 (0 is instant)
      dampAmount: 0.1, //? 0 to ~10 (0 is instant)
      dampMaxSpeed: Infinity,
      ...params
    }
  }

  onEachValue(callback) {
    //! optimized but not readable
    if (!this.smoothedLandmarks) return

    const len = LANDMARK_KEYS.length
    const { smoothedLandmarks, landmarks } = this

    for (const name in smoothedLandmarks) {
      const storedLandmark = smoothedLandmarks[name]
      const newLandmark = landmarks[name]

      for (let i = len; i--;) {
        const key = LANDMARK_KEYS[i]
        const newValue = callback(storedLandmark[key], newLandmark[key], key, storedLandmark)
        storedLandmark[key] = newValue
      }
    }
  }

  target(skeleton) {
    this.isVisible = Boolean(skeleton)
    if (!this.isVisible) return

    this.landmarks = skeleton

    if (!this.smoothedLandmarks) {
      this.smoothedLandmarks = deepCloneObject(this.landmarks)
      for (let name in this.smoothedLandmarks) {
        this.velocities.set(this.smoothedLandmarks[name], this.constructor.createLandmark())
      }
    }
  }

  lerp() {
    const { lerpAmount } = this.params
    this.onEachValue((storedValue, newValue, key, storedLandmark) => {
      return lerp(storedValue, newValue, lerpAmount)
    })

    return this.getSmoothedLandmarks()
  }

  smoothDamp() {

    let { dampMaxSpeed, dampAmount } = this.params

    const deltaTime = this.timer.tick().deltaTime / 1000 //? to seconds

    this.onEachValue((storedValue, newValue, key, storedLandmark) => {
      const velocities = this.velocities.get(storedLandmark)
      const { result, velocity } = smoothDamp(storedValue, newValue, velocities[key], dampAmount, dampMaxSpeed, deltaTime)
      velocities[key] = velocity
      return result
    })

    return this.getSmoothedLandmarks()
  }

  getSmoothedLandmarks() {
    if (!this.isVisible) return undefined
    return this.smoothedLandmarks
  }

  static DEFAULT_LANDMARK = Object.fromEntries(LANDMARK_KEYS.map(name => [name, 0]))

  static createLandmarks() {
    return Object.fromEntries(LANDMARK_ENTRIES.map(([name]) => [name, this.createLandmark()]))
  }

  static createLandmark() {
    return { ...this.DEFAULT_LANDMARK }
  }

}

window.MediaPipeSmoothPose = MediaPipeSmoothPose

export default MediaPipeSmoothPose