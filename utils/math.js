export function lerp(start, stop, amt) {
    return amt * (stop - start) + start
}

export function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max))
}

/**
 * @typedef {Object} DampResult
 * @property {number} result - The new smoothed value
 * @property {number} velocity - The new velocity
 */

/**
 * Unity's smoothDamp port
 * @param {number} current
 * @param {number} target
 * @param {number} currentVelocity
 * @param {number} smoothTime
 * @param {number} maxSpeed
 * @param {number} deltaTime
 * @return {DampResult} new Result
 */
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