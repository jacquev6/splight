'use strict'

require('stringify').registerWithRequire(['.html'])

const express = require('express')
const http = require('http')
const opn = require('opn')
const ws = require('ws')

const adminWebsite = require('./splight/adminWebsite')

async function main (inputDataFile) {
  console.log('Starting webmaster website...')

  const app = express()

  await adminWebsite.populateApp({app, inputDataFile, scripts: ['/shutdown/shutdown.js']})

  app.get(
    '/shutdown/shutdown.js',
    (req, res) => res.type('.js').send("new WebSocket('ws://localhost:8080/')")
  )

  const wss = new ws.Server({
    port: 8080,
    perMessageDeflate: false
  })

  var connectedUsers = 0
  wss.on('connection', socket => {
    connectedUsers++
    console.log('Log in =>', connectedUsers, 'connected users')
    socket.on('close', () => {
      connectedUsers--
      console.log('Log out =>', connectedUsers, 'connected users')
      if (connectedUsers === 0) {
        console.log('Maybe closing server soon')
        setTimeout(() => {
          if (connectedUsers === 0) {
            console.log('Closing server')
            wss.close(() => console.log('WS server closed'))
            server.close(() => console.log('HTTP Server closed'))
          } else {
            console.log('Saving server')
          }
        }, 3000)
      }
    })
  })

  const server = http.Server(app)

  server.listen(8000, () => {
    const address = 'http://localhost:8000/'
    console.log('Webmaster website live at', address)
    opn(address)
  })
}

main(process.argv[2])
