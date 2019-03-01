<template>
  <spa-layout v-if="city" :breadcrumbItems="breadcrumbItems">
    <h1>{{ city.location.name }}</h1>
    <spa-location-details :citySlug="citySlug" :locationSlug="locationSlug" saveButtonTitle="Enregistrer" @saved="$apollo.queries.city.refetch()"/>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

import LocationDetails from './LocationDetails.vue'

export default {
  components: {
    'spa-location-details': LocationDetails
  },
  props: ['citySlug', 'locationSlug'],
  apollo: {
    city: {
      query: gql`query($citySlug:ID!,$locationSlug:ID!){city(slug:$citySlug){name location(slug:$locationSlug){name}}}`,
      variables () {
        return {
          citySlug: this.citySlug,
          locationSlug: this.locationSlug
        }
      }
    }
  },
  computed: {
    breadcrumbItems () {
      return [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Villes', to: { name: 'cities' } },
        { text: this.city.name, to: { name: 'city', params: { citySlug: this.citySlug } } },
        { text: 'Lieux', to: { name: 'locations', params: { citySlug: this.citySlug } } },
        { text: this.city.location.name, to: { name: 'location', params: { citySlug: this.citySlug, locationSlug: this.locationSlug } } }
      ]
    }
  }
}
</script>
