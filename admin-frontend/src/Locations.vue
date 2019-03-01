<template>
  <spa-layout v-if="city" :breadcrumbItems="breadcrumbItems">
    <h1>Nouveau lieu à {{ city.name }}</h1>
    <spa-location-details :citySlug="citySlug" saveButtonTitle="Ajouter" @saved="++refetchTrigger"/>
    <h1>Lieux existants à {{ city.name }}</h1>
    <h2>Filtre</h2>
    <p><label>Nom&nbsp;: <input v-model="filter.name"/></label></p>
    <h2>Résultat</h2>
    <spa-locations-list :citySlug="citySlug" :filter="filter" :refetchTrigger="refetchTrigger"/>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

import LocationDetails from './LocationDetails.vue'
import LocationsList from './LocationsList.vue'

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
    'spa-location-details': LocationDetails,
    'spa-locations-list': LocationsList
  },
  data () {
    return {
      filter: {
        name: ''
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
        { text: 'Lieux', to: { name: 'locations', params: { citySlug: this.citySlug } } }
      ]
    }
  }
}
</script>
