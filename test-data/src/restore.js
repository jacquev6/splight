'use strict'

const gql = require('graphql-tag')
const moment = require('moment')
const mongodb = require('mongodb')
const nodeFetch = require('node-fetch')
const { ApolloClient } = require('apollo-client')
const { HttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')

const data = require('./data.json')

async function main () {
  const mongoDbClient = await mongodb.MongoClient.connect(process.env.SPLIGHT_MONGODB_URL, { useNewUrlParser: true })
  await Promise.all((await mongoDbClient.db('splight').collections()).map(collection => collection.drop()))
  await mongoDbClient.close()

  const apiClient = new ApolloClient({
    link: new HttpLink({ uri: process.env.SPLIGHT_API_URL, fetch: nodeFetch }),
    cache: new InMemoryCache()
  })

  const timeDelta = moment.duration(moment().startOf('isoWeek').diff(moment('2019-02-11T00:00', moment.HTML5_FMT.DATETIME, true)))

  await Promise.all(data.artists.map(async ({ slug, name, image, description, website }) => {
    console.log('Restoring artist', slug)

    await apiClient.mutate({
      mutation: gql`mutation($artist:IArtist!){putArtist(artist:$artist){slug}}`,
      variables: { artist: { slug, name, image, description, website } }
    })
  }))

  await Promise.all(data.cities.map(async ({ slug, name, image, allTagsImage, tags, locations, events }) => {
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

    await Promise.all(events.map(async ({ title, artist, location, tags, occurrences, reservationPage }) => {
      console.log('Restoring event', citySlug, title, artist, location)

      occurrences = occurrences.map(({ start }) => {
        return { start: moment(start, moment.HTML5_FMT.DATETIME, true).add(timeDelta) }
      })

      await apiClient.mutate({
        mutation: gql`mutation($citySlug:ID!,$event:IEvent!){putEvent(citySlug:$citySlug,event:$event){id}}`,
        variables: { citySlug, event: { title, artist, location, tags, occurrences, reservationPage } }
      })
    }))
  }))
}

main()
