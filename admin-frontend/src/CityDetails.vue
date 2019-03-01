<template>
  <div v-if="city && validateCity">
    <spa-input-field title="Slug" v-model="city.slug" :feedback="feedback.slug" :disabled="!!citySlug"/>
    <spa-input-field title="Nom" v-model="city.name" :feedback="feedback.name"/>
    <spa-input-field title="Catégories" v-model="city.tags" :feedback="feedback.tags" :disabled="true"/>
    <spa-image-field title="Image" v-model="city.image" :feedback="feedback.image"/>
    <spa-image-field title="Image pour &quot;Toutes les catégories&quot;" v-model="city.allTagsImage" :feedback="feedback.allTagsImage"/>
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
    saveButtonTitle: {}
  },
  data () {
    return {
      city: this.makeCity()
    }
  },
  apollo: {
    validateCity: {
      query: gql`query($forInsert:Boolean!,$city:ICity!){validateCity(forInsert:$forInsert,city:$city){slug name image allTagsImage}}`,
      variables () {
        return {
          forInsert: !this.citySlug,
          city: { ...this.city } // To be reactive to each field
        }
      },
      skip () {
        return !this.city
      }
    },
    initialCity: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){slug name tags{slug title image} image allTagsImage}}`,
      variables () {
        return {
          citySlug: this.citySlug
        }
      },
      manual: true,
      result ({ data, loading }) {
        if (!loading) {
          const { slug, name, tags, image, allTagsImage } = data.city
          this.city = {
            slug,
            name,
            tags: tags.map(({ slug, title, image }) => ({ slug, title, image })),
            image,
            allTagsImage
          }
        }
      },
      skip () {
        return !this.citySlug
      }
    }
  },
  methods: {
    makeCity () {
      if (this.citySlug) {
        return null
      } else {
        return {
          slug: '',
          name: '',
          tags: [],
          image: null,
          allTagsImage: null
        }
      }
    },
    save () {
      this.$apollo.mutate({
        mutation: gql`mutation($city:ICity!){putCity(city:$city){slug}}`,
        variables: { city: this.city }
      }).then(() => {
        if (!this.citySlug) {
          this.city = this.makeCity()
        }
        this.$emit('saved')
      })
    }
  },
  computed: {
    validating () {
      if (!this.city) return false
      const { slug, name, tags, image, allTagsImage } = this.city
      return slug || name || tags.length || image || allTagsImage
    },
    enabled () {
      if (!this.validateCity) return false
      const { slug, name, tags, image, allTagsImage } = this.validateCity
      return this.validating && !(slug || name || tags || image || allTagsImage)
    },
    feedback () {
      return {
        slug: {
          state: this.validating ? !this.validateCity.slug : null,
          invalid: this.validateCity.slug
        },
        name: {
          state: this.validating ? !this.validateCity.name : null,
          invalid: this.validateCity.name
        },
        tags: {
          state: this.validating ? !this.validateCity.tags : null,
          invalid: this.validateCity.tags
        },
        image: {
          state: this.validating ? !this.validateCity.image : null,
          invalid: this.validateCity.image
        },
        allTagsImage: {
          state: this.validating ? !this.validateCity.allTagsImage : null,
          invalid: this.validateCity.allTagsImage
        }
      }
    }
  }
}
</script>
