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