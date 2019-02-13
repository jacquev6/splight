<template>
  <div>
    <p><label>Slug&nbsp;: <input :disabled="preExisting" v-model="artist.slug"/></label></p>
    <p><label>Nom&nbsp;: <input v-model="artist.name"/></label></p>
    <p><label>Image&nbsp;:
      <input v-if="artist.image === null" type="file" @change="setImage"/>
      <template v-else>
        <b-img fluid :src="artist.image"/>
        <b-btn @click="artist.image = null">Modifier</b-btn>
      </template>
    </label></p>
    <p><label>Description&nbsp;: <textarea v-model="description"></textarea></label></p>
    <p><label>Site officiel&nbsp;: <input v-model="artist.website"/></label></p>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: {
    'artist': {},
    'preExisting': {
      default: true
    }
  },
  data () {
    return {
      rawDescription: null
    }
  },
  methods: {
    setImage (change) {
      const reader = new FileReader()
      reader.onload = e => {
        this.artist.image = e.target.result
      }
      reader.readAsDataURL(change.target.files[0])
    }
  },
  computed: {
    description: {
      get () {
        return this.rawDescription || this.artist.description.join('\n\n')
      },
      set (description) {
        this.rawDescription = description
        this.artist.description = this.rawDescription.split(/\n\n+/).map(part => part.trim()).filter(part => part !== '')
      }
    }
  },
  makeEmpty () {
    return {
      slug: '',
      name: '',
      image: null,
      description: [],
      website: null
    }
  },
  putArtist (apollo, artist) {
    artist = { ...artist }
    delete artist['__typename']
    console.log(artist)
    return apollo.mutate({
      mutation: gql`mutation($artist:IArtist!){putArtist(artist:$artist){slug}}`,
      variables: { artist }
    })
  }
}
</script>
