//! uses global mode p5.js

class Person {
    constructor() {
        this.shown = false
        this.distance = 0
        this.width = 0
        this.height = 0
        this.x = 0
        this.y = 0

        this.skeletonNormalized = new MediaPipeSmoothPose({
            dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
            // dampMaxSpeed: Infinity // max speed, used by smoothDamp()
        })

        this.skeleton = new MediaPipeSmoothPose({
            dampAmount: 0.1, // range ~1-10 [0 is fastest], used by smoothDamp()
        })

    }

    onMediaPipePose(data) {
        const { skeletonNormalized, skeleton } = data

        const isVisible = Boolean(skeleton)
        this.shown = isVisible

        this.skeleton.target(skeleton)
        this.skeletonNormalized.target(skeletonNormalized)
    }

    updateSmoothing() {

        const { skeletonNormalized, skeleton } = this

        const normal = skeletonNormalized.smoothDamp()
        const sk = skeleton.smoothDamp()

        if (!this.shown) return


        this.distance = this.dist2D(sk.LEFT_SHOULDER, sk.RIGHT_HEEL)

        this.height = this.dist2D(this.min(normal, 'y'), this.max(normal, 'y'), "xy")
        this.width = this.dist2D(this.min(normal, 'x'), this.max(normal, 'x'), "xy")
        // this.height = this.dist2D(normal.RIGHT_EYE, normal.LEFT_HEEL, "xy")
        // this.width = this.dist2D(normal.LEFT_WRIST, normal.RIGHT_WRIST, "xy")
        this.x = sk.NOSE.x
        this.y = sk.NOSE.y

        // console.log(this.width)
    }

    dist2D(a, b, coords = "xy") {
        const [key1, key2] = coords.split('')
        return dist(a[key1], a[key2], b[key1], b[key2])
    }

    dist3D(a, b) {
        return dist(a.x, a.y, a.z, b.x, b.y, b.z)
    }

    min(skeleton, key) {
        return this.compute(skeleton, (prev, curr) => curr[key] < prev[key])
    }

    max(skeleton, key) {
        return this.compute(skeleton, (prev, curr) => curr[key] > prev[key])
    }

    compute(skeleton, condition) {
        const [key, value] = Object.entries(skeleton).reduce((prev, curr) => {
            if (!prev) prev = curr
            return condition((prev)[1], curr[1]) ? curr : prev
        }, null)
        return value
    }

}