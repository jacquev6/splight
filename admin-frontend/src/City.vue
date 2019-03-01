<template>
  <spa-layout v-if="city" :breadcrumbItems="breadcrumbItems">
    <h1>{{ city.name }}</h1>
    <h2><router-link :to="{name: 'locations', params: {citySlug}}">Lieux</router-link></h2>
    <h2><router-link :to="{name: 'events', params: {citySlug}}">Événements</router-link></h2>
    <h2>Détails</h2>
    <spa-city-details :citySlug="citySlug" saveButtonTitle="Enregistrer" @saved="$apollo.queries.city.refetch()"/>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

import CityDetails from './CityDetails.vue'

export default {
  components: {
    'spa-city-details': CityDetails
  },
  props: ['citySlug'],
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
  computed: {
    breadcrumbItems () {
      return [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Villes', to: { name: 'cities' } },
        { text: this.city.name, to: { name: 'city', params: { citySlug: this.citySlug } } }
      ]
    }
  }
}
</script>
