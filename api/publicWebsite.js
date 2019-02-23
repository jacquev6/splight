'use strict'

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const expressGraphql = require('express-graphql')

async function makeRouter ({api, scripts, generationDate}) {
  const router = express.Router()

  router.use(cors()) // https://www.prisma.io/blog/enabling-cors-for-express-graphql-apollo-server-1ef999bfb38d
  router.use(bodyParser.json({limit: '50mb'})) // https://stackoverflow.com/a/19965089/905845
  router.use('/graphql', expressGraphql(Object.assign({graphiql: true}, api)))

  return router
}

Object.assign(exports, {makeRouter})
