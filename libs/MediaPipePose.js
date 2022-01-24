import 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@latest/pose.js'
import "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
// import "https://unpkg.com/ml5@latest/dist/ml5.min.js"
import { VideoPlayer } from "/utils/video.js"
import EventBus from '/libs/event-bus.js'
import { lerp } from '/utils/math.js'

const LANDMARK_ENTRIES = Object.entries(window.POSE_LANDMARKS)
const LANDMARK_KEYS = ['x', 'y', 'z', 'visibility']

export default class MediaPipePose extends EventBus {
    constructor(options = {}) {
        super()

        this.videoPlayer
        this.pose

        Object.assign(this, options)

        this.smoothLandmarks = LANDMARK_ENTRIES.map(() => this.constructor.createLandmark())

        this.pose.onResults(async (results) => {
            super.triggerEventListener('pose', this.remapResults(results))
        });

        this.videoPlayer.addEventListener('frame', async (event) => {
            await this.pose.send({ image: event.data.video })
        })
    }

    smoothenLandmarks(newLandmarks, amt) {
        newLandmarks.forEach((newLandmark, index) => {
            const smoothLandmark = this.smoothLandmarks[index]
            LANDMARK_KEYS.forEach(key => {
                smoothLandmark[key] = lerp(smoothLandmark[key], newLandmark[key], amt)
            })
        });
    }

    remapResults(results) {

        const { poseLandmarks, poseWorldLandmarks } = results

        let skeleton = null

        if (poseLandmarks) {
            this.smoothenLandmarks(poseLandmarks, 1 - this.smoothen)
            skeleton = this.constructor.remapLandmarks(this.smoothLandmarks)
        }

        return { skeleton, raw: results }
    }

    getVideoPlayer() {
        return this.videoPlayer;
    }

    startDetection() {
        this.videoPlayer.play()
    }

    static remapLandmarks(poseLandmarks, width, height) {

        return Object.fromEntries(LANDMARK_ENTRIES.map(([name, index]) => {
            const landmark = poseLandmarks[index]
            // const x = poseLandmarks[index] * 
            return [name, landmark]
        }))
    }

    static createLandmark(value = 0) {
        return Object.fromEntries(LANDMARK_KEYS.map(key => [key, value]))
    }

    static async create({ cameraConstraints, width, height, mediaPipeOptions, smoothen = 1 }) {
        const videoPlayer = await VideoPlayer.getStream({ constraints: cameraConstraints, width, height })

        const pose = new window.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
            ...mediaPipeOptions
        });

        return new this({ videoPlayer, pose, smoothen })
    }
}