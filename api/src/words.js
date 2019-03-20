'use strict'

module.exports = async function (db) {
  const collection = db.collection('words')
  await collection.createIndex({ collection: 1, word: 1 })

  return async function (options) {
    var hasIndexed = false
    if (!await collection.findOne({ collection: options.collection })) {
      await Promise.all(await db.collection(options.collection).find().map(add).toArray())
      hasIndexed = true
    }

    async function record (doc) {
      await remove(doc)
      await add(doc)
    }

    async function add (doc) {
      const words = new Set(options.texts(doc).map(s => normalizeWords(s)).flat())

      await Promise.all(Array.from(words, async function (word) {
        await collection.findOneAndUpdate(
          { collection: options.collection, word },
          { $addToSet: { ids: options.id(doc) } },
          { upsert: true }
        )
      }))
    }

    async function remove (doc) {
      await collection.updateMany({}, { $pull: { ids: options.id(doc) } })
    }

    async function retrieve (needle) {
      const words = new Set(normalizeWords(needle || ''))
      if (words.size === 0) {
        throw new TypeError('needle must be a non-blank string')
      } else {
        const idss = await Promise.all(
          Array.from(words, async function (word) {
            const ids = new Set()
            await collection.find({ collection: options.collection, word: { $regex: escapeRegExp(word) } }).forEach(function (it) {
              it.ids.forEach(function (id) {
                ids.add(id)
              })
            })
            return ids
          })
        )
        const ids = idss.reduce(function (a, b) {
          return new Set([...a].filter(x => b.has(x)))
        })
        return [...ids]
      }
    }

    return { hasIndexed, record, remove, retrieve }
  }
}

// We're still pretty bad with punctuation: we're recording and retrieving "l'ogre." as a single word but this will do for now

function normalizeWords (string) {
  // https://stackoverflow.com/a/37511463/905845
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/\s+/).filter(w => w)
}

function escapeRegExp (string) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
