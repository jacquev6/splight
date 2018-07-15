'use strict'

require('stringify').registerWithRequire(['.html'])

const express = require('express')
const http = require('http')
const moment = require('moment')
const opn = require('opn')
const path = require('path')
const ws = require('ws')

const multiYaml = require('./multiYaml')
const publicWebsite = require('./splight/publicWebsite')

async function serve () {
  const app = express()

  for (var [name, content] of publicWebsite.generate({
    data: multiYaml.load(process.argv[2]),
    now: moment(),
    scripts: [
      '/reload/reload.js',
      '/shutdown/shutdown.js'
    ]
  })) {
    (function (name, content) {
      name = '/' + name
      const type = path.extname(name)
      if (name.endsWith('/index.html')) {
        name = name.slice(0, -10)
      }
      app.get(
        name,
        async (req, res) => res.type(type).send(await content)
      )
    })(name, content)
  }
  const server = http.Server(app)

  require('reload')(app)

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
    console.log('Connection => ', connectedUsers, 'connected users')
    socket.on('close', () => {
      connectedUsers--
      console.log('Disconnection => ', connectedUsers, 'connected users')
      if (connectedUsers === 0) {
        console.log('Maybe closing server in a second')
        setTimeout(() => {
          if (connectedUsers === 0) {
            console.log('Closing server')
            server.close(() => {
              console.log('Server closed')
              process.exit(0)
            })
          } else {
            console.log('Saving server')
          }
        }, 1000)
      }
    })
  })

  server.listen(8000, () => {
    const address = 'http://localhost:8000/'
    console.log('Admin site live at', address)
    opn(address)
  })
}

serve()
