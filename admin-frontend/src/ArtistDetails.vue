<template>
  <div v-if="artist && validateArtist">
    <spa-field title="Slug" :invalidFeedback="validateArtist.slug">
      <b-input :disabled="!!artistSlug" v-model="artist.slug" :state="validating ? !validateArtist.slug : null"/>
    </spa-field>
    <spa-field title="Nom" :invalidFeedback="validateArtist.name">
      <b-input v-model="artist.name" :state="validating ? !validateArtist.name : null"/>
    </spa-field>
    <spa-field title="Image" :invalidFeedback="validateArtist.image">
      <template v-if="artist.image === null">
        <b-file @change="setImage" :state="validating ? !validateArtist.image : null"/>
      </template>
      <template v-else>
        <b-img fluid :src="artist.image"/>
        <b-btn @click="artist.image = null">Modifier</b-btn>
      </template>
    </spa-field>
    <spa-field title="Description" :invalidFeedback="validateArtist.description">
      <b-textarea v-model="description" :state="validating ? !validateArtist.description : null"></b-textarea>
    </spa-field>
    <spa-field title="Site officiel" :invalidFeedback="validateArtist.website">
      <b-input v-model="artist.website" :state="validating ? !validateArtist.website : null"/>
    </spa-field>
    <b-row><b-col><b-btn variant="primary" :disabled="!enabled" @click="save">{{ saveButtonTitle }}</b-btn></b-col></b-row>
  </div>
</template>

<script>
import gql from 'graphql-tag'

import DetailsField from './DetailsField.vue'

export default {
  components: {
    'spa-field': DetailsField
  },
  props: {
    artistSlug: {},
    saveButtonTitle: {}
  },
  data () {
    return {
      artist: this.makeArtist(),
      rawDescription: null
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
    setImage (change) {
      const reader = new FileReader()
      reader.onload = e => {
        this.artist.image = e.target.result
      }
      reader.readAsDataURL(change.target.files[0])
    },
    save () {
      this.$apollo.mutate({
        mutation: gql`mutation($artist:IArtist!){putArtist(artist:$artist){slug}}`,
        variables: { artist: this.artist }
      }).then(() => {
        if (!this.artistSlug) {
          this.artist = this.makeArtist()
          this.rawDescription = ''
        }
        this.$emit('saved')
      })
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
      return slug || name || image || description.length || website
    },
    enabled () {
      if (!this.validateArtist) return false
      const { slug, name, image, description, website } = this.validateArtist
      return this.validating && !(slug || name || image || description || website)
    }
  }
}
</script>
