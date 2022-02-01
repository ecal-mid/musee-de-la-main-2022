import http from 'http'
import express from 'express'
import ws from "ws"
import { v4 as uuidv4 } from "uuid"
import path from 'path'

const { PORT = 1575, HOST = "0.0.0.0" } = process.env

const app = express()
app.use(express.static('dist'))

const server = http.createServer(app)
const wss = new ws.Server({ server })

server.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}/`)
})

const clients = new Map()
//
wss.on("connection", (client) => {

    const client_id = uuidv4()

    clients.set(client_id, client)

    client.send(JSON.stringify({ client_id }))

    client.on("message", (data) => {
        const { sender, project_id } = JSON.parse(data)

        clients.forEach(([client_id, otherClient]) => {
            if (client_id === sender) return
            otherClient.send(JSON.stringify({ project_id }))
        })
    })
})
