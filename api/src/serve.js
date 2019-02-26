'use strict'

require('stringify').registerWithRequire(['.gqls'])

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const expressGraphql = require('express-graphql')
const mongodb = require('mongodb')

const authentication = require('./authentication')
const graphqlApi = require('./graphqlApi')

async function serve () {
  console.log('Starting website...')

  const client = await mongodb.MongoClient.connect(process.env.SPLIGHT_MONGODB_URL, { useNewUrlParser: true })
  const db = client.db('splight')
  const { schema, rootValue } = await graphqlApi.make({ db })

  const app = express()

  app.use(bodyParser.json({ limit: '50mb' })) // https://stackoverflow.com/a/19965089/905845
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(cors({ origin: true, credentials: true })) // https://www.npmjs.com/package/cors#configuration-options
  app.use('/graphql', expressGraphql(async (request, response, params) => {
    return {
      schema,
      rootValue,
      context: {
        viewer: authentication.getViewer(request)
      },
      graphiql: true
    }
  }))

  authentication.register(app)

  app.get('/', (req, res) => res.type('text/plain').send('OK'))

  app.listen(80, () => console.log('Website live!'))
}
// @todo Ensure we handle SIGTERM in a timely manner

serve()
