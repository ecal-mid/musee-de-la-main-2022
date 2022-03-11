export function toPercentString(number) {
    const n = (number * 100).toFixed(0)
    return `${n}%`
}

export function clamp(num, min, max) {

    if (min > max) [min, max] = [max, min]

    return Math.min(Math.max(num, min), max)
}

export function lerp(start, stop, amt) {
    return amt * (stop - start) + start
}

export function map(num, start1, stop1, start2, stop2) {
    return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

export function mapClamped(num, start1, stop1, start2, stop2) {
    const res = map(num, start1, stop1, start2, stop2)
    return clamp(res, start2, stop2)
}

export function smoothDamp(current, target, /*ref*/ currentVelocity, smoothTime, maxSpeed = Infinity, deltaTime = 0) {
    smoothTime = Math.max(0.0001, smoothTime)
    let num = 2 / smoothTime
    let num2 = num * deltaTime
    let num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2)
    let num4 = current - target
    let num5 = target
    let num6 = maxSpeed * smoothTime
    num4 = clamp(num4, -num6, num6)
    target = current - num4
    let num7 = (currentVelocity + num * num4) * deltaTime
    currentVelocity = (currentVelocity - num * num7) * num3
    let num8 = target + (num4 + num7) * num3
    if (num5 - current > 0 == num8 > num5) {
        num8 = num5
        currentVelocity = (num8 - num5) / deltaTime
    }
    return { result: num8, velocity: currentVelocity }
}
export class Smoother {
    constructor(options = {}) {
        Object.assign(this, {
            velocity: 0,
            value: 0,
            target: 0,
            maxSpeed: Infinity,
            smoothness: 0.1,
        }, options)
    }

    setTarget(value) {
        this.target = value
    }

    smoothen(deltaTime, target = null) {

        if (target !== null) this.setTarget(target)

        const { result, velocity } = smoothDamp(this.value, this.target, this.velocity, this.smoothness, this.maxSpeed, deltaTime)
        this.value = result
        this.velocity = velocity
        return this.value
    }
}