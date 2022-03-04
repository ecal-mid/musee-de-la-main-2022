export function toPercentString(number) {
    const n = (number * 100).toFixed(0)
    return `${n}%`
}

export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}