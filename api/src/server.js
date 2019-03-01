'use strict'

require('stringify').registerWithRequire(['.gqls'])

const apolloServerExpress = require('apollo-server-express')

const authentication = require('./authentication')
const resolvers = require('./resolvers')
const schema = require('./schema.gqls')
const data_ = require('./data')

async function make (mongoDbClient) {
  const data = data_(mongoDbClient)

  const typeDefs = apolloServerExpress.gql(schema)

  return new apolloServerExpress.ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      viewer: authentication.getViewer(req),
      data
    })
  })
}

Object.assign(module.exports, { make })
