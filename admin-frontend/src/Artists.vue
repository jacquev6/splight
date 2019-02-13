<template>
  <spa-layout v-if="!$apollo.loading" :breadcrumbItems="breadcrumbItems">
    <h1>Nouveau</h1>
    <p><label>Slug&nbsp;: <input v-model="newArtist.slug"/></label></p>
    <p><label>Nom&nbsp;: <input v-model="newArtist.name"/></label></p>
    <p><label>Image&nbsp;:
      <input v-if="newArtist.image === null" type="file" @change="setNewArtistImage"/>
      <template v-else>
        <b-img fluid :src="newArtist.image"/>
        <b-btn @click="newArtist.image = null">Supprimer</b-btn>
      </template>
    </label></p>
    <p><label>Description&nbsp;: <textarea v-model="newArtist.description"></textarea></label></p>
    <p><label>Site officiel&nbsp;: <input v-model="newArtist.website"/></label></p>
    <p><b-btn variant="primary" @click="addArtist">Ajouter</b-btn></p>
    <h1>Existants</h1>
    <h2>Filtre</h2>
    <p><label>Nom&nbsp;: <input v-model="filter.name"/></label></p>
    <h2>Résultat</h2>
    <spa-artists-list :filter="filter" :refetchTrigger="refetchTrigger"/>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

function emptyArtist () {
  return {
    slug: '',
    name: '',
    image: null,
    description: '',
    website: null
  }
}

export default {
  data () {
    return {
      filter: {
        name: '',
      },
      newArtist: emptyArtist(),
      refetchTrigger: 0,
      breadcrumbItems: [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Artistes', to: { name: 'artists' } }
      ]
    }
  },
  methods: {
    setNewArtistImage (change) {
      const reader = new FileReader()
      reader.onload = e => {
        this.newArtist.image = e.target.result
      }
      reader.readAsDataURL(change.target.files[0])
    },
    addArtist () {
      const artist = {
        ...this.newArtist,
        description: this.newArtist.description.split(/\n\n+/).map(part => part.trim()).filter(part => part !== '')
        // image: 
      }
      console.log(artist)
      this.$apollo.mutate({
        mutation: gql`mutation($artist:IArtist!){putArtist(artist:$artist){slug}}`,
        variables: { artist }
      }).then((data) => {
        this.newArtist = emptyArtist()
        ++this.refetchTrigger
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>
