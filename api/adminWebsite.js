'use strict'

const express = require('express')
const mongodb = require('mongodb')

const graphqlApi = require('./graphqlApi')
const publicWebsite = require('./publicWebsite')

async function makeRouter ({scripts}) {
  const router = express.Router()

  const client = await mongodb.MongoClient.connect(process.env.SPLIGHT_MONGODB_URL, {useNewUrlParser: true})
  const db = client.db('splight')
  const api = await graphqlApi.make({db})

  router.use(await publicWebsite.makeRouter({api, scripts}))

  return router
}

Object.assign(exports, {makeRouter})
