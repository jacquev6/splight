'use strict'

/* globals describe, context, before, beforeEach, after, it */

const assert = require('assert').strict
const mondodbMemoryServer = require('mongodb-memory-server')
const mongodb = require('mongodb')

const words__ = require('./words')

describe('words', function () {
  var server
  var client
  var db
  var words_

  before(async () => {
    server = new mondodbMemoryServer.MongoMemoryServer()
    client = await mongodb.MongoClient.connect(await server.getConnectionString(), { useNewUrlParser: true })
    db = client.db('words')
    words_ = await words__(db)
  })

  after(() => {
    client.close()
    server.stop()
  })

  context('with words from day 1', function () {
    var words

    before(async function () {
      words = await words_({
        collection: 'from_day_1',
        id ({ _id }) { return _id },
        texts ({ texts }) { return texts }
      })
    })

    beforeEach(() => db.collection('words').deleteMany({}))

    it('returns nothing on unknown word', async function () {
      assert.deepEqual(await words.retrieve('word'), [])
    })

    it('fails on null needle', async function () {
      await assert.rejects(() => words.retrieve(null), TypeError('needle must be a non-blank string'))
    })

    it('fails on undefined needle', async function () {
      await assert.rejects(() => words.retrieve(undefined), TypeError('needle must be a non-blank string'))
    })

    it('fails on empty needle', async function () {
      await assert.rejects(() => words.retrieve(''), TypeError('needle must be a non-blank string'))
    })

    it('fails on blank needle', async function () {
      await assert.rejects(() => words.retrieve(' \t\r\n '), TypeError('needle must be a non-blank string'))
    })

    it('records a single word in a single document', async function () {
      await words.record({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('word'), ['id'])
    })

    it('records several words in a single document', async function () {
      await words.record({ _id: 'id', texts: ['word1', 'word2', 'word3'] })

      assert.deepEqual(await words.retrieve('word1'), ['id'])
      assert.deepEqual(await words.retrieve('word2'), ['id'])
      assert.deepEqual(await words.retrieve('word3'), ['id'])
      assert.deepEqual(await words.retrieve('word1 word2'), ['id'])
      assert.deepEqual(await words.retrieve('word1 word2 word3'), ['id'])
    })

    it('records several words in several documents', async function () {
      await words.record({ _id: 'id1', texts: ['word2', 'word3'] })
      await words.record({ _id: 'id2', texts: ['word1', 'word3'] })
      await words.record({ _id: 'id3', texts: ['word1', 'word2'] })

      assert.deepEqual(await words.retrieve('word1'), ['id2', 'id3'])
      assert.deepEqual(await words.retrieve('word2'), ['id1', 'id3'])
      assert.deepEqual(await words.retrieve('word3'), ['id1', 'id2'])
      assert.deepEqual(await words.retrieve('word1 word2'), ['id3'])
      assert.deepEqual(await words.retrieve('word1 word3'), ['id2'])
      assert.deepEqual(await words.retrieve('word2 word3'), ['id1'])
      assert.deepEqual(await words.retrieve('word1 word2 word3'), [])
    })

    it('matches partial words', async function () {
      await words.record({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('or'), ['id'])
    })

    it('returns all documents matching a partial word', async function () {
      await words.record({ _id: 'id1', texts: ['word1'] })
      await words.record({ _id: 'id2', texts: ['word2'] })

      assert.deepEqual(await words.retrieve('word'), ['id1', 'id2'])
    })

    it('forgets', async function () {
      await words.record({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('word'), ['id'])

      await words.record({ _id: 'id', texts: ['mot'] })

      assert.deepEqual(await words.retrieve('word'), [])
      assert.deepEqual(await words.retrieve('mot'), ['id'])
    })

    it('forgets several words', async function () {
      await words.record({ _id: 'id', texts: ['word1', 'word2'] })

      assert.deepEqual(await words.retrieve('word1'), ['id'])
      assert.deepEqual(await words.retrieve('word2'), ['id'])

      await words.record({ _id: 'id', texts: ['mot'] })

      assert.deepEqual(await words.retrieve('word1'), [])
      assert.deepEqual(await words.retrieve('word2'), [])
      assert.deepEqual(await words.retrieve('mot'), ['id'])
    })

    it('removes', async function () {
      await words.record({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('word'), ['id'])

      await words.remove({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('word'), [])
    })

    it('removes several words', async function () {
      await words.record({ _id: 'id', texts: ['word1', 'word2'] })

      assert.deepEqual(await words.retrieve('word1'), ['id'])
      assert.deepEqual(await words.retrieve('word2'), ['id'])

      await words.remove({ _id: 'id', texts: ['word1', 'word2'] })

      assert.deepEqual(await words.retrieve('word1'), [])
      assert.deepEqual(await words.retrieve('word2'), [])
    })

    it('ignores diacritics in query', async function () {
      await words.record({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('wôrd'), ['id'])
    })

    it('ignores diacritics in text', async function () {
      await words.record({ _id: 'id', texts: ['wôrd'] })

      assert.deepEqual(await words.retrieve('word'), ['id'])
    })

    it('ignores case in query', async function () {
      await words.record({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('wOrd'), ['id'])
    })

    it('ignores case in text', async function () {
      await words.record({ _id: 'id', texts: ['wOrd'] })

      assert.deepEqual(await words.retrieve('word'), ['id'])
    })

    it('forbids regex search', async function () {
      await words.record({ _id: 'id', texts: ['word'] })

      assert.deepEqual(await words.retrieve('w.rd'), [])
    })
  })

  context('with pre-existing documents', function () {
    it('indexes pre-existing documents', async function () {
      const collectionName = 'pre_existing'
      const collection = db.collection(collectionName)
      await collection.insertOne({ _id: 'id1', texts: ['word1'] })
      await collection.insertOne({ _id: 'id2', texts: ['word2'] })

      var words = await words_({
        collection: collectionName,
        id ({ _id }) { return _id },
        texts ({ texts }) { return texts }
      })

      assert.equal(words.hasIndexed, true)

      assert.deepEqual(await words.retrieve('word'), ['id1', 'id2'])

      const words2 = await words_({ collection: collectionName })

      assert.equal(words2.hasIndexed, false)
    })
  })
})
