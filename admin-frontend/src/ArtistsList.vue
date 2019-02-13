<template>
  <p v-if="!artists">Chargement...</p>
  <p v-else-if="artists.length === 0">Aucun artiste ne correspond au filtre</p>
  <ul v-else>
    <li v-for="artist in artists" :key="artist.slug">
      <router-link :to="{name: 'artist', params: {artistSlug: artist.slug}}">{{ artist.name }}</router-link>
    </li>
  </ul>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: ['filter', 'refetchTrigger'],
  apollo: {
    artists: {
      query: gql`query($name:String!){artists(name:$name){slug name}}`,
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
      this.$apollo.queries.artists.refetch()
    }
  }
}
</script>
