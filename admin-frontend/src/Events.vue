<template>
  <spa-layout v-if="city" :breadcrumbItems="breadcrumbItems">
    <h1>Nouvel événement à {{ city.name }}</h1>
    <spa-event-details :citySlug="citySlug" saveButtonTitle="Ajouter" @saved="++refetchTrigger"/>
    <h1>Événements existants à {{ city.name }}</h1>
    <h2>Filtre</h2>
    <p>todo</p>
    <h2>Résultat</h2>
    <spa-events-list :citySlug="citySlug" :filter="filter" :refetchTrigger="refetchTrigger"/>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

import EventDetails from './EventDetails.vue'
import EventsList from './EventsList.vue'

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    }
  },
  apollo: {
    city: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){name}}`,
      variables () {
        return {
          citySlug: this.citySlug
        }
      }
    }
  },
  components: {
    'spa-event-details': EventDetails,
    'spa-events-list': EventsList
  },
  data () {
    return {
      filter: {
      },
      refetchTrigger: 0
    }
  },
  computed: {
    breadcrumbItems () {
      return [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Villes', to: { name: 'cities' } },
        { text: this.city.name, to: { name: 'city', params: { citySlug: this.citySlug } } },
        { text: 'Événements', to: { name: 'events', params: { citySlug: this.citySlug } } }
      ]
    }
  }
}
</script>
