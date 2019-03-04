<template>
  <div v-if="validateLocation">
    <spa-input-field title="Slug" v-model="location.slug" :feedback="feedback.slug" :disabled="!!locationSlug"/>
    <spa-input-field title="Nom" v-model="location.name" :feedback="feedback.name"/>
    <spa-image-field title="Image" v-model="location.image" :feedback="feedback.image"/>
    <spa-textarea-field title="Description" v-model="location.description" :feedback="feedback.description"/>
    <spa-input-field title="Site web" v-model="location.website" :feedback="feedback.website"/>
    <spa-input-field title="Téléphone" v-model="location.phone" :feedback="feedback.phone"/>
    <spa-textarea-field title="Adresse" v-model="location.address" :feedback="feedback.address" :splitter="/\n/" :joiner="'\n'"/>
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
    citySlug: {},
    locationSlug: {},
    saveButtonTitle: {}
  },
  data () {
    return {
      location: this.makeLocation()
    }
  },
  apollo: {
    validateLocation: {
      query: gql`query($forInsert:Boolean!,$citySlug:ID!,$location:ILocation!){validateLocation(forInsert:$forInsert,citySlug:$citySlug,location:$location){slug name image description website phone address}}`,
      variables () {
        return {
          forInsert: !this.locationSlug,
          citySlug: this.citySlug,
          location: { ...this.location } // To be reactive to each field
        }
      },
      skip () {
        return !this.location
      }
    },
    initialLocation: {
      query: gql`query($citySlug:ID!,$locationSlug:ID!){city(slug:$citySlug){name location(slug:$locationSlug){slug name image description website phone address}}}`,
      variables () {
        return {
          citySlug: this.citySlug,
          locationSlug: this.locationSlug
        }
      },
      manual: true,
      result ({ data, loading }) {
        if (!loading) {
          const { slug, name, image, description, website, phone, address } = data.city.location
          this.location = { slug, name, image, description, website, phone, address }
        }
      },
      skip () {
        return !this.locationSlug
      }
    }
  },
  methods: {
    makeLocation () {
      if (this.locationSlug) {
        return null
      } else {
        return {
          slug: '',
          name: '',
          image: null,
          description: [],
          website: '',
          phone: null,
          address: []
        }
      }
    },
    save () {
      this.$apollo.mutate({
        mutation: gql`mutation($citySlug:ID!,$location:ILocation!){putLocation(citySlug:$citySlug,location:$location){slug}}`,
        variables: {
          citySlug: this.citySlug,
          location: this.location
        }
      }).then(() => {
        if (this.locationSlug) {
          this.$apollo.queries.initialLocation.refetch()
        } else {
          this.location = this.makeLocation()
        }
        this.$emit('saved')
      })
    }
  },
  computed: {
    validating () {
      if (!this.location) return false
      const { slug, name, image, description, website, phone, address } = this.location
      return slug || name || image || description.length || website || phone || address.length
    },
    enabled () {
      if (!this.validateLocation) return false
      const { slug, name, image, description, website, phone, address } = this.validateLocation
      return this.validating && !(slug || name || image || description || website || phone || address)
    },
    feedback () {
      return {
        slug: {
          state: this.validating ? !this.validateLocation.slug : null,
          invalid: this.validateLocation.slug
        },
        name: {
          state: this.validating ? !this.validateLocation.name : null,
          invalid: this.validateLocation.name
        },
        image: {
          state: this.validating ? !this.validateLocation.image : null,
          invalid: this.validateLocation.image
        },
        description: {
          state: this.validating ? !this.validateLocation.description : null,
          invalid: this.validateLocation.description
        },
        website: {
          state: this.validating ? !this.validateLocation.website : null,
          invalid: this.validateLocation.website
        },
        phone: {
          state: this.validating ? !this.validateLocation.phone : null,
          invalid: this.validateLocation.phone
        },
        address: {
          state: this.validating ? !this.validateLocation.address : null,
          invalid: this.validateLocation.address
        }
      }
    }
  }
}
</script>
