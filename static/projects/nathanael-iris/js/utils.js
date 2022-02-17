export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
export function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

export async function delay(millis) {
    await new Promise((resolve) => setTimeout(resolve, millis))
}