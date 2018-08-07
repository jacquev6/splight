'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const express = require('express')
const http = require('http')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line
const opn = require('opn')
const ws = require('ws')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const adminWebsite = require('./splight/adminWebsite')

async function main (dataDirectory) {
  console.log('Starting webmaster website...')

  const app = express()

  app.use(await adminWebsite.makeRouter({dataDirectory, scripts: ['/shutdown/shutdown.js']}))

  app.get(
    '/shutdown/shutdown.js',
    (req, res) => res.type('.js').send("const shutdown = new WebSocket('ws://localhost:8080/')")
  )

  const wss = new ws.Server({
    port: 8080,
    perMessageDeflate: false
  })

  var timeoutId = null
  var connectedUsers = 0
  wss.on('connection', socket => {
    connectedUsers++
    console.log('Log in =>', connectedUsers, 'connected users')
    if (timeoutId) {
      console.log('Saving server')
      clearTimeout(timeoutId)
      timeoutId = null
    }
    socket.on('close', () => {
      connectedUsers--
      console.log('Log out =>', connectedUsers, 'connected users')
      if (connectedUsers === 0) {
        console.log('Maybe closing server soon')
        timeoutId = setTimeout(() => {
          console.log('Closing server')
          var closed = 0
          function exitWhenClosed (server) {
            return function () {
              console.log(server, 'server closed')
              if (++closed === 2) {
                console.log('Exiting')
                // I don't know why sometimes the server's process doesn't exit after both servers are closed.
                // I need to investigate that, but in the mean time, let's ensure we don't hit that case in production.
                process.exit(0)
              }
            }
          }
          wss.close(exitWhenClosed('WS'))
          server.close(exitWhenClosed('HTTP'))
        }, 3000)
      }
    })
  })

  const server = http.Server(app)

  server.listen(8000, () => {
    const address = 'http://localhost:8000/admin/'
    console.log('Webmaster website live at', address)
    opn(address)
  })
}

main(process.argv[2])
