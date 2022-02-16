import express from 'express'
import cors from 'cors'
import { promises as fs } from 'fs'
import formidable from 'formidable'
import minimist from 'minimist'
import { Path } from './utils.js'

let PATH

const CONFIG = {
    port: 1080,
    host: '0.0.0.0',
    cors: true,
    folder: '../storage',
    ...minimist(process.argv.slice(2), {
        alias: {
            p: 'port',
            h: 'host',
            f: 'folder',
        }
    })
}

const app = express()
PATH = new Path({ address: CONFIG.host, port: CONFIG.port })

const server = app.listen(CONFIG.port, CONFIG.host, () => {
    const { address, port } = server.address()
    console.log(`Server: ${PATH.getServerPath()}`)
    console.log(`Example: ${PATH.getServerPath('example')}`)
    // PATH.getAbsolutePath(CONFIG.folder, dirPath)
})

if (CONFIG.cors === true)
app.use(cors())

app.use('/', express.static(PATH.getAbsolutePath(CONFIG.folder).pathname))

app.get('/*', (request, response, next) => {

    const dirPath = request.path

    fs.readdir(PATH.getAbsolutePath(CONFIG.folder, dirPath), { withFileTypes: true }).then(filenames => {

        const directory = []

        filenames.forEach((entry) => {

            const { name } = entry

            if (PATH.isHiddenFile(name)) return

            const url = PATH.getServerPath(dirPath, name)

            directory.push({
                name,
                url,
                isFile: entry.isFile()
            })
        })

        response.send(directory)

    }).catch((err) => {
        response.sendStatus(404)
    })
})

app.post('/*', async (request, response) => {

    await fs.mkdir(PATH.getAbsolutePath(CONFIG.folder, request.path), { recursive: true })
    const form = formidable({
        keepExtensions: true
    })

    form.parse(request, (err, fields, files) => {
        if (err) {
            response.sendStatus(404)
            return
        }
        
        let msg = ''

        const names = Object.values(files).map(file => file.newFilename)
        if (names.length > 0)
        msg = `Successfully saved ${names.join(', ')}`
        
        response.send(msg)
    })
    
    form.on("fileBegin", (name, file) => {
        const fileName = file.originalFilename
        // console.log(file.originalFilename)

        if (!fileName) return
        
        file.filepath = PATH.getAbsolutePath(CONFIG.folder, request.path, fileName)
        file.newFilename = fileName
    })
})

app.delete('/*', async (request, response) => {
    const { pathname } = PATH.getAbsolutePath(CONFIG.folder, request.path)
    console.log(pathname, request.path)

    try {
        await fs.rm(pathname, { recursive: true, force: true })
        response.send("success")
    } catch (e) {
        console.log(e)
        response.sendStatus(404)
    }

})