'use strict'

require('stringify').registerWithRequire(['.gqls'])

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const expressGraphql = require('express-graphql')
const mongodb = require('mongodb')

const graphqlApi = require('./graphqlApi')

async function serve () {
  console.log('Starting website...')

  const client = await mongodb.MongoClient.connect(process.env.SPLIGHT_MONGODB_URL, { useNewUrlParser: true })
  const db = client.db('splight')
  const api = await graphqlApi.make({ db })

  const app = express()

  app.use(cors()) // https://www.prisma.io/blog/enabling-cors-for-express-graphql-apollo-server-1ef999bfb38d
  app.use(bodyParser.json({ limit: '50mb' })) // https://stackoverflow.com/a/19965089/905845
  app.use('/graphql', expressGraphql(Object.assign({ graphiql: true }, api)))

  app.listen(80, () => console.log('Website live!'))
}
// @todo Ensure we handle SIGTERM in a timely manner

serve()
