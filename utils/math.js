export function lerp(start, stop, amt) {
    return amt * (stop - start) + start;
}