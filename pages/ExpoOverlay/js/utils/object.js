export function NO_OP() { }

//TODO
export function random(a, b) {
    if (arguments.length === 1) {

        if (Array.isArray(a)) {

            const index = Math.floor(Math.random() * a.length)

            return a[index]

        } else if (typeof a === 'object') {

            return random(Object.values(a))

        }


    }


}