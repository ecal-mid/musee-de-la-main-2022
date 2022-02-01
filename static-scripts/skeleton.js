const ML5_BODY_PARTS = [
    "leftEar",
    "rightEar",
    "rightEye",
    "leftEye",
    "nose",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow",
    "leftWrist",
    "rightWrist",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle",
]

const MEDIA_PIPE_BODY_PARTS = [
    "NOSE",
    "LEFT_EYE_INNER",
    "LEFT_EYE",
    "LEFT_EYE_OUTER",
    "RIGHT_EYE_INNER",
    "RIGHT_EYE",
    "RIGHT_EYE_OUTER",
    "LEFT_EAR",
    "RIGHT_EAR",
    "LEFT_RIGHT",
    "RIGHT_LEFT",
    "LEFT_SHOULDER",
    "RIGHT_SHOULDER",
    "LEFT_ELBOW",
    "RIGHT_ELBOW",
    "LEFT_WRIST",
    "RIGHT_WRIST",
    "LEFT_PINKY",
    "RIGHT_PINKY",
    "LEFT_INDEX",
    "RIGHT_INDEX",
    "LEFT_THUMB",
    "RIGHT_THUMB",
    "LEFT_HIP",
    "RIGHT_HIP",
    "LEFT_KNEE",
    "RIGHT_KNEE",
    "LEFT_ANKLE",
    "RIGHT_ANKLE",
    "LEFT_HEEL",
    "RIGHT_HEEL",
    "LEFT_FOOT_INDEX",
    "RIGHT_FOOT_INDEX"
]

class Skeleton {
    constructor() {
        this.result
        this.width
        this.height
    }

    update(result) {
        this.result = result
    }

    show(ctx, { color = 'red' } = {}) {
        if (!this.result) return

        ctx.save()

        const { width, height } = ctx.canvas

        ctx.beginPath()

        ctx.strokeStyle = color
        ctx.lineWidth = 10
        ctx.lineCap = 'round'

        MEDIA_PIPE_BODY_PARTS.forEach(bodyPart => {
            const point = this.result[bodyPart]
            this.drawPoint(ctx, { x: point.x * width, y: point.y * height }) //! result are normalized points from MediaPipe Pose { x, y, z, visibility }
        })

        ctx.stroke()

        ctx.restore()
    }

    drawPoint(ctx, { x, y }) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + 0.01, y)
    }
}
window.Skeleton = Skeleton
export default Skeleton