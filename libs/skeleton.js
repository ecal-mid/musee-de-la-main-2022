const BODY_PARTS = [
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

export default class Skeleton {
    constructor() {
        this.result;
        this.width;
        this.height;
    }

    update(result) {
        this.result = result
    }

    show(ctx) {
        if (!this.result) return

        const { pose } = this.result

        ctx.lineWidth = 10
        ctx.strokeStyle = 'lime'
        ctx.lineCap = 'round'

        ctx.beginPath()

        BODY_PARTS.forEach(bodyPart => {
            const point = pose[bodyPart]
            this.drawPoint(ctx, point)
        })

        ctx.stroke()
    }

    drawPoint(ctx, { x, y }) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + 0.01, y)
    }
}