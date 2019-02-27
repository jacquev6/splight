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
const schemaString = require('./graphqlApi.gqls')

async function serve () {
  console.log('Starting website...')

  const client = await mongodb.MongoClient.connect(process.env.SPLIGHT_MONGODB_URL, { useNewUrlParser: true })
  const db = client.db('splight')
  const dbArtists = db.collection('artists')
  const dbCities = db.collection('cities')
  const dbEvents = db.collection('events')
  const dbLocations = db.collection('locations')
  const dbSequences = db.collection('sequences')

  const typeDefs = apolloServerExpress.gql(schemaString)

  const server = new apolloServerExpress.ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      viewer: authentication.getViewer(req),
      dbArtists,
      dbCities,
      dbEvents,
      dbLocations,
      dbSequences
    })
  })

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
