'use strict'

const gql = require('graphql-tag')
const moment = require('moment')
const mongodb = require('mongodb')
const nodeFetch = require('node-fetch')
const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')

const generator = require('./generator')

async function restore (data) {
  console.log('Erasing everything')
  const mongoDbClient = await mongodb.MongoClient.connect(process.env.SPLIGHT_MONGODB_URL, { useNewUrlParser: true })
  await Promise.all((await mongoDbClient.db('splight').collections()).map(collection => collection.drop()))
  await mongoDbClient.close()

  const apiClient = new ApolloClient({
    link: new HttpLink({ uri: process.env.SPLIGHT_API_URL, fetch: nodeFetch }),
    cache: new InMemoryCache()
  })

  await Promise.all(data.artists.map(async ({ slug, name, image, description, website }) => {
    console.log('Restoring artist', slug)

    await apiClient.mutate({
      mutation: gql`mutation($artist:IArtist!){putArtist(artist:$artist){slug}}`,
      variables: { artist: { slug, name, image, description, website } }
    })
  }))

  // Await each city to be able to await each event, to ensure event ids are stable when restored
  for (var { slug, name, image, allTagsImage, tags, locations, events } of data.cities) {
    console.log('Restoring city', slug)

    await apiClient.mutate({
      mutation: gql`mutation($city:ICity!){putCity(city:$city){slug}}`,
      variables: { city: { slug, name, image, allTagsImage, tags } }
    })

    const citySlug = slug

    await Promise.all(locations.map(async ({ slug, name, image, description, website, address, phone }) => {
      console.log('Restoring location', citySlug, slug)

      await apiClient.mutate({
        mutation: gql`mutation($citySlug:ID!,$location:ILocation!){putLocation(citySlug:$citySlug,location:$location){slug}}`,
        variables: { citySlug, location: { slug, name, image, description, website, address, phone } }
      })
    }))

    await (async function () {
      for (var { title, artist, location, tags, occurrences, reservationPage } of events) {
        console.log('Restoring event', citySlug, title, artist, location)

        occurrences = occurrences.map(({ start }) => {
          return { start }
        })

        await apiClient.mutate({
          mutation: gql`mutation($citySlug:ID!,$event:IEvent!){putEvent(citySlug:$citySlug,event:$event){id}}`,
          variables: { citySlug, event: { title, artist, location, tags, occurrences, reservationPage } }
        })
      }
    })()
  }
}

function slugify (string) {
  return string.toLowerCase().replace(/[\s.]+/g, '-')
}

const randomData = (function (geni) {
  const artists = geni.array(50, function (geni) {
    const name = geni.faker().name.findName()
    return {
      slug: slugify(name),
      name,
      description: geni.array(geni.int(0, 4), geni => geni.faker().lorem.paragraph()),
      website: geni.bool(0.7) ? `https://google.com/search?q=${name}` : null,
      image: geni.bool(0.9) ? `http://lorempixel.com/253/200/people/${geni.int(1, 11)}` : null
    }
  })

  const cities = geni.array(4, function (geni) {
    const name = geni.faker().address.city()

    const tags = geni.array(geni.int(3, 7), function (geni) {
      const title = geni.faker().commerce.product()
      return {
        slug: slugify(title),
        title,
        image: `http://lorempixel.com/253/200/cats/${geni.int(1, 11)}`
      }
    })

    const locations = geni.array(geni.int(25, 50), function (geni) {
      const name = geni.faker().address.streetName()
      return {
        slug: slugify(name),
        name,
        description: geni.array(geni.int(0, 4), geni => geni.faker().lorem.paragraph()),
        website: geni.bool(0.7) ? `https://google.com/search?q=${name}` : null,
        image: geni.bool(0.9) ? `http://lorempixel.com/253/200/nightlife/${geni.int(1, 11)}` : null,
        phone: geni.bool(0.6) ? (function () { const faker = geni.faker(); faker.locale = 'fr'; return faker.phone.phoneNumber() })() : null,
        address: null // @todo
      }
    })

    const firstDate = moment().startOf('isoWeek').subtract(1, 'week').format(moment.HTML5_FMT.DATE)
    const lastDate = moment().startOf('isoWeek').add(10, 'week').format(moment.HTML5_FMT.DATE)

    return {
      slug: slugify(name),
      name,
      tags,
      locations,
      image: `http://lorempixel.com/253/200/city/${geni.int(1, 11)}`,
      allTagsImage: `http://lorempixel.com/1104/200/abstract/${geni.int(1, 11)}`,
      events: geni.array(geni.int(100, 150), function (geni) {
        const { hasTitle, hasArtist } = geni.pickOne([{ hasTitle: true, hasArtist: true }, { hasTitle: true, hasArtist: false }, { hasTitle: false, hasArtist: true }])
        const title = hasTitle ? geni.coolstory() : null
        const artist = hasArtist ? geni.pickOne(artists).slug : null
        return {
          title,
          artist,
          location: geni.pickOne(locations).slug,
          tags: geni.pick(geni.bool(0.1) ? geni.int(2, 4) : 1, tags).map(({ slug }) => slug),
          occurrences: geni.array(geni.int(1, 5), geni => ({ start: geni.faker().date.between(firstDate, lastDate) })),
          reservationPage: geni.bool(0.7) ? `https://google.com/search?q=${title || artist.name}` : null
        }
      })
    }
  })

  return { artists, cities }
})(generator('a'))

restore(randomData)
