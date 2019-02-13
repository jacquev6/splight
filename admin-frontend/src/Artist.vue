<template>
  <spa-layout v-if="!$apollo.loading" :breadcrumbItems="breadcrumbItems">
    <h1>{{ artist.name }}</h1>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: ['artistSlug'],
  apollo: {
    artist: {
      query: gql`query($artistSlug:ID!){artist(slug:$artistSlug){name}}`,
      variables () {
        return {
          artistSlug: this.artistSlug
        }
      }
    }
  },
  computed: {
    breadcrumbItems () {
      return [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Artistes', to: { name: 'artists' } },
        { text: this.artist.name, to: { name: 'artist', params: { artistSlug: this.artistSlug } } }
      ]
    }
  }
}
</script>
