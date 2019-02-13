<template>
  <spa-layout v-if="artist" :breadcrumbItems="breadcrumbItems">
    <h1>{{ artist.name }}</h1>
    <spa-artist-details :initialArtist="artist" saveButtonTitle="Enregistrer" @saved="$apollo.queries.artist.refetch()"/>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

import ArtistDetails from './ArtistDetails.vue'

export default {
  components: {
    'spa-artist-details': ArtistDetails
  },
  props: ['artistSlug'],
  apollo: {
    artist: {
      query: gql`query($artistSlug:ID!){artist(slug:$artistSlug){slug name image description website}}`,
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
