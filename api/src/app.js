'use strict'

require('stringify').registerWithRequire(['.gqls'])

const apolloServerExpress = require('apollo-server-express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const mongodb = require('mongodb')

const authentication = require('./authentication')
const resolvers = require('./resolvers')
const schema = require('./schema.gqls')
const data_ = require('./data')

module.exports = async function ({ mongodbUrl }) {
  const mongoDbClient = await mongodb.MongoClient.connect(mongodbUrl, { useNewUrlParser: true })

  const data = data_(mongoDbClient)

  const typeDefs = apolloServerExpress.gql(schema)

  const server = new apolloServerExpress.ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      viewer: authentication.getViewer(req),
      data
    })
  })

  const app = express()

  app.use(bodyParser.json({ limit: '50mb' })) // https://stackoverflow.com/a/19965089/905845
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(cors({ origin: true, credentials: true })) // https://www.npmjs.com/package/cors#configuration-options

  server.applyMiddleware({ app, cors: { origin: true, credentials: true } })

  authentication.register(app)

  app.get('/', (req, res) => res.type('text/plain').send('OK'))

  const originalListen = app.listen

  app.listen = function () {
    const server = originalListen.call(this, ...arguments)
    server.on('close', function () {
      mongoDbClient.close()
    })
    return server
  }

  return app
}
