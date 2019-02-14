<template>
  <spa-layout :breadcrumbItems="breadcrumbItems">
    <h1>Villes existantes</h1>
    <spa-cities-list/>
  </spa-layout>
</template>

<script>
import CitiesList from './CitiesList.vue'

export default {
  components: {
    'spa-cities-list': CitiesList
  },
  data () {
    return {
      breadcrumbItems: [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Villes', to: { name: 'Cities' } }
      ]
    }
  }
}
</script>
