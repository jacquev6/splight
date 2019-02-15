<template>
  <div v-if="artist && validateArtist">
    <spa-input-field title="Slug" v-model="artist.slug" :feedback="feedback.slug" :disabled="!!artistSlug"/>
    <spa-input-field title="Nom" v-model="artist.name" :feedback="feedback.name"/>
    <spa-image-field title="Image" v-model="artist.image" :feedback="feedback.image"/>
    <!-- @todo Fix following bug
      Reproduce:
        - load existing artist
        - edit description
        - save
      Expect:
        - no change in fields
      Observe:
        - description is reverted to previous value
        - new description is restored on reload
      Also in LocationDetails, on description and address
    -->
    <spa-textarea-field title="Description" v-model="artist.description" :feedback="feedback.description"/>
    <spa-input-field title="Site web" v-model="artist.website" :feedback="feedback.website"/>
    <b-row><b-col><b-btn variant="primary" :disabled="!enabled" @click="save">{{ saveButtonTitle }}</b-btn></b-col></b-row>
  </div>
</template>

<script>
import gql from 'graphql-tag'

import Fields from './fields'

export default {
  components: {
    ...Fields
  },
  props: {
    artistSlug: {},
    saveButtonTitle: {}
  },
  data () {
    return {
      artist: this.makeArtist()
    }
  },
  apollo: {
    validateArtist: {
      query: gql`query($forInsert:Boolean!,$artist:IArtist!){validateArtist(forInsert:$forInsert,artist:$artist){slug name image description website}}`,
      variables () {
        return {
          forInsert: !this.artistSlug,
          artist: { ...this.artist } // To be reactive to each field in this.artist
        }
      },
      skip () {
        return !this.artist
      }
    },
    initialArtist: {
      query: gql`query($artistSlug:ID!){artist(slug:$artistSlug){slug name image description website}}`,
      variables () {
        return {
          artistSlug: this.artistSlug
        }
      },
      manual: true,
      result ({ data, loading }) {
        if (!loading) {
          const { slug, name, image, description, website } = data.artist
          this.artist = { slug, name, image, description, website }
        }
      },
      skip () {
        return !this.artistSlug
      }
    }
  },
  methods: {
    makeArtist () {
      if (this.artistSlug) {
        return null
      } else {
        return {
          slug: '',
          name: '',
          image: null,
          description: [],
          website: ''
        }
      }
    },
    save () {
      this.$apollo.mutate({
        mutation: gql`mutation($artist:IArtist!){putArtist(artist:$artist){slug}}`,
        variables: { artist: this.artist }
      }).then(() => {
        if (!this.artistSlug) {
          this.artist = this.makeArtist()
        }
        this.$emit('saved')
      })
    }
  },
  computed: {
    validating () {
      if (!this.artist) return false
      const { slug, name, image, description, website } = this.artist
      return slug || name || image || description.length || website
    },
    enabled () {
      if (!this.validateArtist) return false
      const { slug, name, image, description, website } = this.validateArtist
      return this.validating && !(slug || name || image || description || website)
    },
    feedback () {
      return {
        slug: {
          state: this.validating ? !this.validateArtist.slug : null,
          invalid: this.validateArtist.slug
        },
        name: {
          state: this.validating ? !this.validateArtist.name : null,
          invalid: this.validateArtist.name
        },
        image: {
          state: this.validating ? !this.validateArtist.image : null,
          invalid: this.validateArtist.image
        },
        description: {
          state: this.validating ? !this.validateArtist.description : null,
          invalid: this.validateArtist.description
        },
        website: {
          state: this.validating ? !this.validateArtist.website : null,
          invalid: this.validateArtist.website
        }
      }
    }
  }
}
</script>
