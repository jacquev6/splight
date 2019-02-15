<template>
  <!-- @todo Factorize the common logic in XxxsList somehow -->
  <p v-if="!city">Chargement...</p>
  <p v-else-if="city.events.length === 0">Aucun événement ne correspond au filtre</p>
  <ul v-else>
    <li v-for="event in city.events" :key="event.id">
      <router-link :to="{name: 'event', params: {citySlug, eventId: event.id}}">{{ event.title }} (<template v-if="event.artist">{{ event.artist.name }}, </template>{{ event.location.name }})</router-link>
    </li>
  </ul>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: ['citySlug', 'filter', 'refetchTrigger'],
  apollo: {
    city: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){name events{id title artist{name} location{name}}}}`,
      variables () {
        return {
          citySlug: this.citySlug
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
