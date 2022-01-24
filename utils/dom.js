export function getAll(selector, parent = document) {
    return [...parent.querySelectorAll(selector)]
}