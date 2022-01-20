export function removeElementFromArray(array, element) {
    const index = array.indexOf(element);
    let elemWasRemoved = false
    if (index > -1) {
        array.splice(index, 1);
        elemWasRemoved = true
    }
    return elemWasRemoved
}