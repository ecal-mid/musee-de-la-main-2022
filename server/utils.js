import process from 'process'

export class Path {
    constructor(params) {

        this.params = {
            server: '',
            address: '',
            post: '',
            protocol: 'http://',
            local: import.meta.url,
            ...params
        }
    }

    isHiddenFile(name) {
        return (/(^|\/)\.[^\/\.]/g).test(name)
    }

    getAbsolutePath(...paths) {
        const fullPath = this.sanitize(paths)
        return new URL(`${fullPath}`, this.params.local)
    }

    getRelativePath(...paths) {
        return this.sanitize(paths)
    }
    
    sanitize(paths) {
        const fullPath = paths
        .map(path => String(path).replace(/^\/|\/$/g, ''))
        .filter(Boolean)
        .join('/')
        
        return fullPath
    }

    getServerPath(...paths) {
        const { address, port, protocol } = this.params
        const fullPath = this.sanitize(paths)

        return new URL(`${protocol}${address}:${port}/${fullPath}`)
    }
}