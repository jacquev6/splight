'use strict'

require('stringify').registerWithRequire(['.gqls'])

const apolloServerExpress = require('apollo-server-express')

const authentication = require('./authentication')
const resolvers = require('./resolvers')
const schema = require('./schema.gqls')

async function make (mongoDbClient) {
  const db = mongoDbClient.db('splight')
  const dbArtists = db.collection('artists')
  const dbCities = db.collection('cities')
  const dbEvents = db.collection('events')
  const dbLocations = db.collection('locations')
  const dbSequences = db.collection('sequences')

  const typeDefs = apolloServerExpress.gql(schema)

  return new apolloServerExpress.ApolloServer({
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
}

Object.assign(module.exports, { make })
