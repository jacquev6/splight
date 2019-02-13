<template>
  <spa-layout :breadcrumbItems="breadcrumbItems">
    <h1>Nouveau</h1>
    <spa-artist-details :artist="newArtist" :preExisting="false"/>
    <!-- @todo Disable button when ^ artist-details fails validation -->
    <p><b-btn variant="primary" @click="addArtist">Ajouter</b-btn></p>
    <h1>Existants</h1>
    <h2>Filtre</h2>
    <p><label>Nom&nbsp;: <input v-model="filter.name"/></label></p>
    <h2>Résultat</h2>
    <spa-artists-list :filter="filter" :refetchTrigger="refetchTrigger"/>
  </spa-layout>
</template>

<script>
import ArtistsList from './ArtistsList.vue'
import ArtistDetails from './ArtistDetails.vue'

export default {
  components: {
    'spa-artists-list': ArtistsList,
    'spa-artist-details': ArtistDetails
  },
  data () {
    return {
      filter: {
        name: ''
      },
      newArtist: ArtistDetails.makeEmpty(),
      refetchTrigger: 0,
      breadcrumbItems: [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Artistes', to: { name: 'artists' } }
      ]
    }
  },
  methods: {
    addArtist () {
      ArtistDetails.putArtist(this.$apollo, this.newArtist).then(() => {
        this.newArtist = ArtistDetails.makeEmpty()
        ++this.refetchTrigger
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>
