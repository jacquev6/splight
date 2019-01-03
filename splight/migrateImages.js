'use strict'

const fs = require('fs-extra')
const mongodb = require('mongodb')

function findImage (prefix, baseFileName) {
  const pngFileName = 'test-data/images/' + baseFileName + '.png'
  const jpgFileName = 'test-data/images/' + baseFileName + '.jpg'
  if (fs.existsSync(pngFileName)) {
    console.log(prefix, 'png')
    return 'data:image/png;base64,' + Buffer.from(fs.readFileSync(pngFileName)).toString('base64')
  } else if (fs.existsSync(jpgFileName)) {
    console.log(prefix, 'jpeg')
    return 'data:image/jpeg;base64,' + Buffer.from(fs.readFileSync(jpgFileName)).toString('base64')
  } else {
    console.log(prefix, 'none')
    return null
  }
}

async function main () {
  const client = await mongodb.MongoClient.connect('mongodb://splight-mongo:27017/', {useNewUrlParser: true})
  const db = client.db('splight')

  const artistsCollection = db.collection('artists')
  const citiesCollection = db.collection('cities')
  const locationsCollection = db.collection('locations')

  ; (await artistsCollection.find().toArray()).forEach(async function (artist) {
    artist.image = findImage(`artist ${artist._id}`, `artists/${artist._id}`)
    await artistsCollection.replaceOne({_id: artist._id}, artist)
  })

  ; (await citiesCollection.find().toArray()).forEach(async function (city) {
    city.image = findImage(`city ${city._id}`, `cities/${city._id}`)
    city.allTagsImage = findImage(`city ${city._id} all-tags`, `cities/${city._id}/all-tags`)
    city.tags.forEach(function (tag) {
      tag.image = findImage(`tag ${city._id} ${tag.slug}`, `cities/${city._id}/tags/${tag.slug}`)
    })
    await citiesCollection.replaceOne({_id: city._id}, city)
  })

  ; (await locationsCollection.find().toArray()).forEach(async function (location) {
    const locationSlug = location._id.split(':')[1]
    location.image = findImage(`location ${location.citySlug} ${locationSlug}`, `cities/${location.citySlug}/locations/${locationSlug}`)
    await locationsCollection.replaceOne({_id: location._id}, location)
  })

  await client.close()
}

main()
