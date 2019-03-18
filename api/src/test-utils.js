'use strict'

/* globals before, after */

const apolloLink = require('apollo-link')
const apolloLinkHttp = require('apollo-link-http')
const assert = require('assert').strict
const fetch = require('node-fetch')
const mondodbMemoryServer = require('mongodb-memory-server')
const mongodb = require('mongodb')

const makeApp = require('./app')

module.exports = function () {
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

  after(() => {
    mongodbClient.close()
    mongodbServer.stop()
    httpServer.close()
  })

  async function run (query, variables) {
    try {
      return await apolloLink.toPromise(apolloLink.execute(link, { query, variables }))
    } catch (e) {
      /* istanbul ignore next: test code */
      console.log(e.result)
      /* istanbul ignore next: test code */
      throw e
    }
  }

  async function success (query, variables, expected) {
    assert.deepEqual(await run(query, variables), { data: expected })
  }

  async function error (query, variables, expected) {
    const actual = await run(query, variables)
    assert(actual.errors)
    assert(actual.errors.length)
    assert.deepEqual(actual.errors[0].message, expected)
  }

  async function reset () {
    const collections = ['artists', 'cities', 'events', 'locations', 'sequences']
    await Promise.all(collections.map(coll => mongodbClient.db('splight').collection(coll).deleteMany({})))
  }

  return { run, success, error, reset }
}
