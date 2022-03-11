export function NO_OP() { }

//TODO
export function random(a, b) {
    if (arguments.length === 1) {

        if (Array.isArray(a)) {

            const index = Math.floor(Math.random() * a.length)

            return a[index]

        } else if (typeof a === 'object') {

            return random(Object.values(a))

        } else if (isNumber(a)) {
            return random(0, a)
        }
    }

    return Math.random() * (b - a) + a
}

export function isNumber(elem) {
    return !(isNaN(elem) || elem === null)
}


export function mapObject(obj, callback = NO_OP) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
        return [key, callback(value, key, obj)]
    }))
}

export function deepCloneObject(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function deleteFromArray(arr, elem) {
    const index = arr.indexOf(elem)
    if (index >= 0) arr.splice(index, 1)
}

export function fillArray(amount, entry) {
    return new Array(amount).fill(entry)
}

export function delay(millis) {
    return new Promise(resolve => setTimeout(resolve, millis))
}