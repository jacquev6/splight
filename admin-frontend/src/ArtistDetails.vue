<template>
  <div v-if="validateArtist">
    <spa-field title="Slug" :invalidFeedback="slugValidation">
      <b-input :disabled="preExisting" v-model="artist.slug" :state="validating ? !slugValidation : null"/>
    </spa-field>
    <spa-field title="Nom" :invalidFeedback="nameValidation">
      <b-input v-model="artist.name" :state="validating ? !nameValidation : null"/>
    </spa-field>
    <spa-field title="Image" :invalidFeedback="imageValidation">
      <template v-if="artist.image === null">
        <b-file @change="setImage" :state="validating ? !imageValidation : null"/>
      </template>
      <template v-else>
        <b-img fluid :src="artist.image"/>
        <b-btn @click="artist.image = null">Modifier</b-btn>
      </template>
    </spa-field>
    <spa-field title="Description" :invalidFeedback="descriptionValidation">
      <b-textarea v-model="description" :state="validating ? !descriptionValidation : null"></b-textarea>
    </spa-field>
    <spa-field title="Site officiel" :invalidFeedback="websiteValidation">
      <b-input v-model="artist.website" :state="validating ? !websiteValidation : null"/>
    </spa-field>
  </div>
</template>

<script>
import gql from 'graphql-tag'

import ArtistDetailsField from './ArtistDetailsField.vue'

export default {
  components: {
    'spa-field': ArtistDetailsField
  },
  props: {
    'artist': {},
    'preExisting': {
      default: true
    }
  },
  apollo: {
    validateArtist: {
      query: gql`query($forInsert:Boolean!,$artist:IArtist!){validateArtist(forInsert:$forInsert,artist:$artist){field message}}`,
      variables () {
        const artist = { ...this.artist }
        delete artist['__typename']
        const forInsert = !this.preExisting
        return { forInsert, artist }
      }
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
    },
    fieldValidation (fieldName) {
      const messages = this.validateArtist.filter(({ field }) => field === fieldName).map(({ message }) => message)
      if (messages.length > 0) {
        return messages[0]
      } else {
        return null
      }
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
    },
    validating () {
      const { slug, name, image, description, website } = this.artist
      return slug !== '' || name !== '' || image !== null || description.length !== 0 || website !== null
    },
    slugValidation () { return this.fieldValidation('slug') },
    nameValidation () { return this.fieldValidation('name') },
    imageValidation () { return this.fieldValidation('image') },
    descriptionValidation () { return this.fieldValidation('description') },
    websiteValidation () { return this.fieldValidation('website') }
  },
  watch: {
    artist () {
      this.rawDescription = null
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
    return apollo.mutate({
      mutation: gql`mutation($artist:IArtist!){putArtist(artist:$artist){slug}}`,
      variables: { artist }
    })
  }
}
</script>
