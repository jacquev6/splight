<template>
  <spa-layout :breadcrumbItems="breadcrumbItems">
    <h1>Nouvelle ville</h1>
    <spa-city-details saveButtonTitle="Ajouter" @saved="++refetchTrigger"/>
    <h1>Villes existantes</h1>
    <h2>Filtre</h2>
    <p><label>Nom&nbsp;: <input v-model="filter.name"/></label></p>
    <h2>Résultat</h2>
    <spa-cities-list :filter="filter" :refetchTrigger="refetchTrigger"/>
  </spa-layout>
</template>

<script>
import CityDetails from './CityDetails.vue'
import CitiesList from './CitiesList.vue'

export default {
  components: {
    'spa-city-details': CityDetails,
    'spa-cities-list': CitiesList
  },
  data () {
    return {
      filter: {
        name: ''
      },
      refetchTrigger: 0,
      breadcrumbItems: [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Villes', to: { name: 'Cities' } }
      ]
    }
  }
}
</script>
