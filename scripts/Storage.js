class Storage {
    constructor(params = {}) {

        if (typeof params === 'string')
            params = { path: params }

        this.params = {
            origin: window.location.origin,
            path: '/',
            ...params
        }
    }

    getFullURL(path) {
        let url = ''

        try {
            url = new URL(path)
        } catch (e) {
            url = new URL(path, this.params.origin)
            url.pathname = this.getFullPath([this.params.path, url.pathname])
        }

        return url
    }

    getFullPath(paths) {
        const fullPath = paths
            .filter(Boolean)
            .map(path => String(path).replace(/^\/|\/$/g, ''))
            .filter(Boolean)
            .join('/')

        return fullPath
    }

    async fetch(path, ...args) {
        const url = this.getFullURL(path)
        return fetch(url, ...args)
    }

    async list(path = '/') {
        return await this.fetch(path).then(resp => resp.json()).catch(e => { })
    }

    splitFilePath(filePath) {
        const sections = filePath.split('/').filter(Boolean)
        const fileName = sections.pop()
        const path = sections.join('/')

        const matchImage = fileName.match(/\.(jpe?g|png|gif|bmp)$/i)
        const type = matchImage ? `image/${matchImage[1]}` : undefined

        return { fileName, path, type }
    }

    async upload(filePath, data) {

        const { path, fileName, type } = this.splitFilePath(filePath)

        const formData = new FormData()

        if (data instanceof Image) {
            const blob = await this.imageToBlob(data)
            formData.append('file', blob, fileName)
        } else if (data instanceof HTMLCanvasElement) {
            const blob = await this.canvasToBlob(data, { type })
            formData.append('file', blob, fileName)
        } else if (data instanceof Blob) {
            formData.append('file', data, fileName)
        } else if (typeof data === 'string') {
            const blob = this.stringToBlob(data)
            formData.append('file', blob, fileName)
        } else if (typeof data === 'object' && fileName.endsWith('.json')) {
            const blob = this.stringToBlob(JSON.stringify(data), { type: 'application/json' })
            formData.append('file', blob, fileName)
        }

        await this.fetch(path, {
            body: formData, method: 'post',
        }).then(e => e.text())

        const { href } = this.getFullURL(path)

        // console.log('kldhjakfjgjk', fileName);
        return `${href}/${fileName}`
    }

    stringToBlob(string, options) {
        return new Blob([string], { type: 'text/plain', ...options })
    }

    async imageToBlob(image) {

        image.crossOrigin = ''

        if (!image.complete) await new Promise(resolve => {
            image.addEventListener('load', resolve, { once: true })
        })

        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        canvas.getContext('2d').drawImage(image, 0, 0)

        return await this.canvasToBlob(canvas)
    }

    async canvasToBlob(canvas, { type = 'image/png', quality } = {}) {
        return new Promise(resolve => canvas.toBlob(resolve, type, quality))
    }

    async delete(path = '') {
        return await this.fetch(path, { method: 'delete' }).then(e => e.text())
    }
}