<template>
  <!-- @todo Evaluate https://github.com/posva/vue-promised -->
  <p v-if="!cities">Chargement...</p>
  <p v-else-if="cities.length === 0">Aucune ville ne correspond au filtre</p>
  <ul v-else>
    <li v-for="city in cities" :key="city.slug">
      <router-link :to="{name: 'city', params: {citySlug: city.slug}}">{{ city.name }}</router-link>
    </li>
  </ul>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: ['filter', 'refetchTrigger'],
  apollo: {
    cities: {
      query: gql`query($name:String!){cities(name:$name){slug name}}`,
      variables () {
        return {
          name: this.filter.name
        }
      },
      debounce: 100
    }
  },
  watch: {
    refetchTrigger () {
      this.$apollo.queries.cities.refetch()
    }
  }
}
</script>
