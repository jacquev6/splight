<template>
  <spa-layout :breadcrumbItems="breadcrumbItems">
    <h1>Nouveau</h1>
    <spa-artist-details saveButtonTitle="Ajouter" @saved="++refetchTrigger"/>
    <h1>Existants</h1>
    <h2>Filtre</h2>
    <p><label>Nom&nbsp;: <input v-model="filter.name"/></label></p>
    <h2>Résultat</h2>
    <spa-artists-list :filter="filter" :refetchTrigger="refetchTrigger"/>
  </spa-layout>
</template>

<script>
import ArtistDetails from './ArtistDetails.vue'
import ArtistsList from './ArtistsList.vue'

export default {
  components: {
    'spa-artist-details': ArtistDetails,
    'spa-artists-list': ArtistsList
  },
  data () {
    return {
      filter: {
        name: ''
      },
      refetchTrigger: 0,
      breadcrumbItems: [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Artistes', to: { name: 'artists' } }
      ]
    }
  }
}
</script>
