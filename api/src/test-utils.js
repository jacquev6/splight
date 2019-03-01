'use strict'

/* globals before, after, afterEach */

const apolloLink = require('apollo-link')
const apolloLinkHttp = require('apollo-link-http')
const assert = require('assert').strict
const fetch = require('node-fetch')
const mondodbMemoryServer = require('mongodb-memory-server')
const mongodb = require('mongodb')

const makeApp = require('./app')

module.exports = function () {
  const mongodbClients = []
  var mongodbClient
  var mongodbServer
  var httpServer
  var link

  before(async () => {
    mongodbServer = new mondodbMemoryServer.MongoMemoryServer()
    const mongodbUrl = await mongodbServer.getConnectionString()

    mongodbClient = await mongodb.MongoClient.connect(mongodbUrl, { useNewUrlParser: true })

    const app = await makeApp({ mongodbUrl })

    httpServer = await app.listen(0)
    const port = httpServer.address().port
    link = new apolloLinkHttp.HttpLink({ uri: `http://localhost:${port}/graphql`, fetch })
  })

  afterEach(async () => {
    const collections = [
      'artists',
      'cities',
      'events',
      'locations',
      'sequences'
    ]
    await Promise.all(collections.map(coll => mongodbClient.db('splight').collection(coll).deleteMany({})))
  })

  after(() => {
    mongodbClients.forEach(client => client.close())
    mongodbClient.close()
    mongodbServer.stop()
    httpServer.close()
  })

  function run (query, variables = {}) {
    return apolloLink.toPromise(apolloLink.execute(link, { query, variables }))
  }

  async function success (query, variables, expected) {
    if (!expected) {
      expected = variables
      variables = {}
    }
    assert.deepEqual(await run(query, variables), { data: expected })
  }

  async function makeMongodbClient () {
    const client = await mongodb.MongoClient.connect(await mongodbServer.getConnectionString(), { useNewUrlParser: true })
    mongodbClients.push(client)
    return client
  }

  return { run, success, makeMongodbClient }
}
