'use strict'

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')

const authentication = require('./authentication')
const server_ = require('./server')

async function serve () {
  console.log('Starting website...')

  const server = await server_.make(
    await mongodb.MongoClient.connect(process.env.SPLIGHT_MONGODB_URL, { useNewUrlParser: true })
  )

  const app = express()

  app.use(bodyParser.json({ limit: '50mb' })) // https://stackoverflow.com/a/19965089/905845
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(cors({ origin: true, credentials: true })) // https://www.npmjs.com/package/cors#configuration-options

  server.applyMiddleware({
    app,
    cors: { origin: true, credentials: true }
  })

  authentication.register(app)

  app.get('/', (req, res) => res.type('text/plain').send('OK'))

  app.listen(80, () => console.log('Website live!'))
}
// @todo Ensure we handle SIGTERM in a timely manner

serve()
