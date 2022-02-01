import http from 'http'
import express from 'express'
import ws from "ws"
import { v4 as uuidv4 } from "uuid"

import ip from 'ip'
import cors from 'cors'

const { PORT = 1575, HOST = "0.0.0.0" } = process.env

const app = express()
app.use(cors())
app.use(express.static('dist'))

const server = http.createServer(app)
const wss = new ws.Server({ server })

server.listen(PORT, HOST, () => {
    console.log(`Running on http://${ip.address()}:${PORT}/`)
})

const clients = new Map()
//
wss.on("connection", (client) => {

    const client_id = uuidv4()

    clients.set(client_id, client)

    client.send(JSON.stringify({ client_id }))

    client.on("message", (data) => {
        const { sender, project_id } = JSON.parse(data)

        clients.forEach((otherClient, client_id) => {
            if (client_id === sender) return
            otherClient.send(JSON.stringify({ project_id }))
        })
    })
})
