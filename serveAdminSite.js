'use strict'

const fs = require('fs-extra')
const http = require('http')
const path = require('path')

const express = require('express')
const opn = require('opn')
const ws = require('ws')

require('stringify').registerWithRequire(['.html'])

const multiYaml = require('./multiYaml')
const generator = require('./splight/generator')

async function serve () {
  const assets = '.assets'

  await fs.emptyDir(assets)
  await generator.assets.generate(assets)

  const htmlGenerator = generator.html.generator(multiYaml.load(process.argv[2]), true)

  const app = express()
  const server = http.Server(app)

  require('reload')(app)

  app.use(express.static(path.join(__dirname, assets)))

  // @todo Add a favicon in skeleton
  app.get(
    '/favicon.ico',
    (req, res) => res.status(404)
  )

  app.get(
    '/cities.json',
    async (req, res) => res.send(await htmlGenerator.citiesData())
  )

  app.get(
    '/',
    async (req, res) => res.send(await htmlGenerator.indexPage())
  )

  app.get(
    '/:city/',
    async (req, res) => res.send(await htmlGenerator.cityPage(req.params.city))
  )

  app.get(
    '/:city/:timespan.json',
    async (req, res) => res.send(await htmlGenerator.timespanData(req.params.city, req.params.timespan))
  )

  app.get(
    '/:city/:timespan/',
    async (req, res) => res.send(await htmlGenerator.timespanPage(req.params.city, req.params.timespan))
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
