'use strict'

/* globals describe, context, before, after, it */

// Run with (cd api; npx "mocha --watch src/exploratory-mongodb-tests.js")

const assert = require('assert').strict
const mondodbMemoryServer = require('mongodb-memory-server')
const mongodb = require('mongodb')

describe('mongodb', function () {
  var server
  var client
  var db

  before(async () => {
    server = new mondodbMemoryServer.MongoMemoryServer()
    client = await mongodb.MongoClient.connect(await server.getConnectionString(), { useNewUrlParser: true })
    db = client.db('explore')
  })

  after(() => {
    client.close()
    server.stop()
  })

  const makeName = (function () {
    var index = 0

    return function () {
      ++index
      return `c${index}`
    }
  })()

  function makeColl () {
    return db.collection(makeName())
  }

  describe('text index', function () {
    /*
    These tests explore what we can do with a text index in MongoDB. This doesn't look good for our use-case:
    while the user is typing her query, we want to progressively narrow the documents returned. But text indexes
    return more and more documents when words are added. And they don't return "The Beattles" when the query is "bea"
    because they match on full words (stems actually).
    */

    it('fails $text search without text index', async function () {
      const collection = makeColl()
      await collection.insertOne({})

      assert.rejects(
        () => collection.find({ $text: { $search: 'foo' } }).toArray(),
        new mongodb.MongoError('text index required for $text query')
      )
    })

    it('drops text index with the collection', async function () {
      const name = makeName()
      const collection = db.collection(name)
      await collection.createIndex({ '$**': 'text' })

      assert.deepEqual(await collection.find({ $text: { $search: 'foo' } }).toArray(), [])

      collection.drop()

      assert.rejects(() => collection.find({ $text: { $search: 'foo' } }).toArray(), mongodb.MongoError)
    })

    it('uses the text index for $text search', async function () {
      const collection = makeColl()
      await collection.createIndex({ '$**': 'text' })

      const plan = (await collection.find({ $text: { $search: 'foo' } }).explain()).queryPlanner.winningPlan
      assert.equal(plan.stage, 'TEXT')
      assert.equal(plan.indexName, '$**_text')
      assert.equal(plan.inputStage.stage, 'TEXT_MATCH')
      assert.equal(plan.inputStage.inputStage.stage, 'FETCH')
      assert.equal(plan.inputStage.inputStage.inputStage.stage, 'OR')
      assert.equal(plan.inputStage.inputStage.inputStage.inputStage.stage, 'IXSCAN')
      assert.equal(plan.inputStage.inputStage.inputStage.inputStage.inputStage, undefined)
    })

    it('does not use the text index for $regex search', async function () {
      const collection = makeColl()
      await collection.createIndex({ 'a': 'text' })
      await collection.createIndex({ 'a': 1 })

      const plan = (await collection.find({ a: /^foo/ }).explain()).queryPlanner.winningPlan
      assert.equal(plan.stage, 'FETCH')
      assert.equal(plan.inputStage.stage, 'IXSCAN')
      assert.equal(plan.inputStage.indexName, 'a_1')
      assert.equal(plan.inputStage.inputStage, undefined)
    })

    it('does not use the text index for $regex search', async function () {
      const collection = makeColl()
      await collection.createIndex({ 'a': 'text' })

      const plan = (await collection.find({ a: /^foo/ }).explain()).queryPlanner.winningPlan
      assert.equal(plan.stage, 'COLLSCAN')
      assert.equal(plan.inputStage, undefined)
    })

    context("with a wildcard index with language 'english'", function () {
      var collection

      before(async function () {
        collection = makeColl()
        await collection.createIndex({ '$**': 'text' }, { default_language: 'english' })
        await collection.insertOne({ title: 'The Grapes of Wrath' })
        await collection.insertOne({ title: 'Wrath of the Lich King' })
      })

      function make (search, expected) {
        return async function () {
          assert.deepEqual(
            await collection.find({ $text: { $search: search } }, { projection: { _id: 0 } }).toArray(),
            expected
          )
        }
      }

      it('finds unique word', make('grapes', [{ title: 'The Grapes of Wrath' }]))

      it('finds duplicated word', make('wrath', [{ title: 'The Grapes of Wrath' }, { title: 'Wrath of the Lich King' }]))

      it('does not invent matches', make('words not found', []))

      it('finds two words', make('grapes king', [{ title: 'The Grapes of Wrath' }, { title: 'Wrath of the Lich King' }]))

      it('ignores small English words', make('the', []))
      it('ignores small English words', make('of', []))
      it('ignores small English words', make('the king', [{ title: 'Wrath of the Lich King' }]))

      it('ignores partial words', make('kin', []))
      it('ignores partial words', make('wrat', []))

      it('stems English plurals', make('kings', [{ title: 'Wrath of the Lich King' }]))
      it('stems English plurals', make('grape', [{ title: 'The Grapes of Wrath' }]))
    })

    context("with a wildcard index with language 'french'", function () {
      var collection

      before(async function () {
        collection = makeColl()
        await collection.createIndex({ '$**': 'text' }, { default_language: 'french' })
        await collection.insertOne({ title: 'Les Raisins de la colère' })
        await collection.insertOne({ title: 'La colère du Roi-Liche' })
      })

      function make (search, expected) {
        return async function () {
          assert.deepEqual(
            await collection.find({ $text: { $search: search } }, { projection: { _id: 0 } }).toArray(),
            expected
          )
        }
      }

      it('finds unique word', make('raisins', [{ title: 'Les Raisins de la colère' }]))

      it('finds duplicated word', make('colère', [{ title: 'Les Raisins de la colère' }, { title: 'La colère du Roi-Liche' }]))

      it('is diacritical-insensitive', make('coleré', [{ title: 'Les Raisins de la colère' }, { title: 'La colère du Roi-Liche' }]))

      it('does not invent matches', make('mots non trouvés', []))

      it('finds two words', make('raisin roi', [{ title: 'Les Raisins de la colère' }, { title: 'La colère du Roi-Liche' }]))

      it('ignores small French words', make('la', []))
      it('ignores small French words', make('de', []))
      it('ignores small French words', make('le roi', [{ title: 'La colère du Roi-Liche' }]))

      it('ignores partial words', make('coler', []))
      it('ignores partial words', make('raisi', []))

      it('stems French plurals', make('liches', [{ title: 'La colère du Roi-Liche' }]))
      it('stems French plurals', make('raisin', [{ title: 'Les Raisins de la colère' }]))
    })

    context("with a wildcard index with language 'none'", function () {
      var collection

      before(async function () {
        collection = makeColl()
        await collection.createIndex({ '$**': 'text' }, { default_language: 'none' })
        await collection.insertOne({ title: 'The Grapes of Wrath' })
        await collection.insertOne({ title: 'Wrath of the Lich King' })
      })

      function make (search, expected) {
        return async function () {
          assert.deepEqual(
            await collection.find({ $text: { $search: search } }, { projection: { _id: 0 } }).toArray(),
            expected
          )
        }
      }

      it('finds unique word', make('grapes', [{ title: 'The Grapes of Wrath' }]))

      it('finds small English words', make('the', [{ title: 'The Grapes of Wrath' }, { title: 'Wrath of the Lich King' }]))
      it('finds small English words', make('of', [{ title: 'The Grapes of Wrath' }, { title: 'Wrath of the Lich King' }]))
    })
  })

  describe('regex search', function () {
    it('uses an index for a rooted regex', async function () {
      const collection = makeColl()
      await collection.createIndex({ key: 1 })

      const plan = (await collection.find({ key: /^abc/ }).explain()).queryPlanner.winningPlan
      assert.equal(plan.stage, 'FETCH')
      assert.equal(plan.inputStage.stage, 'IXSCAN')
      assert.equal(plan.inputStage.indexName, 'key_1')
      assert.deepEqual(plan.inputStage.indexBounds, { key: [ '["abc", "abd")', '[/^abc/, /^abc/]' ] })
    })

    it('uses an index for a free regex', async function () {
      const collection = makeColl()
      await collection.createIndex({ key: 1 })

      const plan = (await collection.find({ key: /abc/ }).explain()).queryPlanner.winningPlan
      assert.equal(plan.stage, 'FETCH')
      assert.equal(plan.inputStage.stage, 'IXSCAN')
      assert.equal(plan.inputStage.indexName, 'key_1')
      assert.deepEqual(plan.inputStage.indexBounds, { key: [ '["", {})', '[/abc/, /abc/]' ] })
    })

    it('returns documents matching regex case-sensitivity and rooting', async function () {
      const collection = makeColl()
      await collection.createIndex({ key: 1 })
      await collection.insertOne({ key: 'abcdef' })
      await collection.insertOne({ key: 'abcgih' })
      await collection.insertOne({ key: 'jklabcmno' })
      await collection.insertOne({ key: 'Abcpqr' })

      assert.deepEqual(
        await collection.find({ key: /abc/ }, { projection: { _id: 0 } }).toArray(),
        [{ key: 'abcdef' }, { key: 'abcgih' }, { key: 'jklabcmno' }]
      )

      assert.deepEqual(
        await collection.find({ key: /abc/i }, { projection: { _id: 0 } }).toArray(),
        [{ key: 'Abcpqr' }, { key: 'abcdef' }, { key: 'abcgih' }, { key: 'jklabcmno' }]
      )

      assert.deepEqual(
        await collection.find({ key: /^abc/ }, { projection: { _id: 0 } }).toArray(),
        [{ key: 'abcdef' }, { key: 'abcgih' }]
      )

      assert.deepEqual(
        await collection.find({ key: /^aBc/i }, { projection: { _id: 0 } }).toArray(),
        [{ key: 'Abcpqr' }, { key: 'abcdef' }, { key: 'abcgih' }]
      )
    })
  })
})
