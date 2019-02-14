<template>
  <p v-if="!city">Chargement...</p>
  <p v-else-if="city.locations.length === 0">Aucun lieu ne correspond au filtre</p>
  <ul v-else>
    <li v-for="location in city.locations" :key="location.slug">
      <router-link :to="{name: 'location', params: {citySlug, locationSlug: location.slug}}">{{ location.name }}</router-link>
    </li>
  </ul>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: ['citySlug', 'filter', 'refetchTrigger'],
  apollo: {
    city: {
      query: gql`query($citySlug:ID!,$name:String!){city(slug:$citySlug){name locations(name:$name){slug name}}}`,
      variables () {
        return {
          citySlug: this.citySlug,
          name: this.filter.name
        }
      },
      debounce: 100
    }
  },
  watch: {
    refetchTrigger () {
      this.$apollo.queries.city.refetch()
    }
  }
}
</script>
