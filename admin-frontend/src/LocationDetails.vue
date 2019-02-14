<template>
  <div v-if="validateLocation">
    <spa-field title="Slug" :invalidFeedback="validateLocation.slug">
      <b-input :disabled="!!initialLocation" v-model="location.slug" :state="validating ? !validateLocation.slug : null"/>
    </spa-field>
    <spa-field title="Nom" :invalidFeedback="validateLocation.name">
      <b-input v-model="location.name" :state="validating ? !validateLocation.name : null"/>
    </spa-field>
    <spa-field title="Image" :invalidFeedback="validateLocation.image">
      <template v-if="location.image === null">
        <b-file @change="setImage" :state="validating ? !validateLocation.image : null"/>
      </template>
      <template v-else>
        <b-img fluid :src="location.image"/>
        <b-btn @click="location.image = null">Modifier</b-btn>
      </template>
    </spa-field>
    <spa-field title="Description" :invalidFeedback="validateLocation.description">
      <b-textarea v-model="description" :state="validating ? !validateLocation.description : null"></b-textarea>
    </spa-field>
    <spa-field title="Site officiel" :invalidFeedback="validateLocation.website">
      <b-input v-model="location.website" :state="validating ? !validateLocation.website : null"/>
    </spa-field>
    <spa-field title="Téléphone" :invalidFeedback="validateLocation.phone">
      <b-input v-model="location.phone" :state="validating ? !validateLocation.phone : null"/>
    </spa-field>
    <spa-field title="Adresse" :invalidFeedback="validateLocation.address">
      <b-textarea v-model="address" :state="validating ? !validateLocation.address : null"></b-textarea>
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
    citySlug: {},
    initialLocation: {}, // @todo Accept a locationSlug instead, and fetch it. Currently two files need to know the list of fields in Location
    saveButtonTitle: {}
  },
  data () {
    return {
      location: this.makeLocation(),
      rawDescription: null,
      rawAddress: null
    }
  },
  apollo: {
    validateLocation: {
      query: gql`query($forInsert:Boolean!,$citySlug:ID!,$location:ILocation!){validateLocation(forInsert:$forInsert,citySlug:$citySlug,location:$location){slug name image description website phone address}}`,
      variables () {
        return {
          forInsert: !this.initialLocation,
          citySlug: this.citySlug,
          location: { ...this.location } // Required for reactiveness. Don't ask why...
        }
      }
    }
  },
  methods: {
    makeLocation () {
      const { slug, name, image, description, website, phone, address } = this.initialLocation || {
        slug: '',
        name: '',
        image: null,
        description: [],
        website: '',
        phone: null,
        address: []
      }
      return { slug, name, image, description, website, phone, address }
    },
    setImage (change) {
      const reader = new FileReader()
      reader.onload = e => {
        this.location.image = e.target.result
      }
      reader.readAsDataURL(change.target.files[0])
    },
    save () {
      this.$apollo.mutate({
        mutation: gql`mutation($citySlug:ID!,$location:ILocation!){putLocation(citySlug:$citySlug,location:$location){slug}}`,
        variables: {
          citySlug: this.citySlug,
          location: this.location
        }
      }).then(() => {
        if (!this.initialLocation) {
          this.location = this.makeLocation()
          this.rawDescription = ''
          this.rawAddress = ''
        }
        this.$emit('saved')
      })
    }
  },
  computed: {
    description: {
      get () {
        return this.rawDescription || this.location.description.join('\n\n')
      },
      set (description) {
        this.rawDescription = description
        this.location.description = this.rawDescription.split(/\n\n+/).map(part => part.trim()).filter(part => part !== '')
      }
    },
    address: {
      get () {
        return this.rawAddress || this.location.address.join('\n')
      },
      set (address) {
        this.rawAddress = address
        this.location.address = this.rawAddress.split(/\n+/).map(part => part.trim()).filter(part => part !== '')
      }
    },
    validating () {
      const { slug, name, image, description, website, phone, address } = this.location
      return slug || name || image || description.length || website || phone || address.length
    },
    enabled () {
      const { slug, name, image, description, website, phone, address } = this.validateLocation
      return this.validating && !(slug || name || image || description || website || phone || address)
    }
  }
}
</script>
