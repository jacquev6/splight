<template>
  <sp-layout>
    <template v-slot:subtitle>
      <span> - <router-link :to="{name: 'city', params: {citySlug}}">{{ city. name }}</router-link></span>
    </template>

    <template v-slot:content>
      <b-row><b-col>
        <p><router-link :to="{name: 'cities'}"><img class="img-fluid" alt="Toute l'actualité" :src="city.allTagsImage" /></router-link></p>
        <p><router-link :to="{name: 'cities'}">Toute l'actualité</router-link></p>
      </b-col></b-row>

      <b-row><b-col>
        <h1>Catégories</h1>
      </b-col></b-row>

      <b-row>
        <b-col v-for="tag in city.tags" :key="tag.slug" cols="6" md="3">
          <p><router-link :to="{name: 'cities'}"><img class="img-fluid" :alt="tag.title" :src="tag.image" /></router-link></p>
          <p><router-link :to="{name: 'cities'}">{{ tag.title }}</router-link></p>
        </b-col>
      </b-row>
    </template>
  </sp-layout>
</template>

<script>
import gql from 'graphql-tag'

// @todo How can we do this globally?
import Layout from '../Layout.vue'

export default {
  props: [
    'citySlug'
  ],
  data () {
    return {
      city: {}
    }
  },
  apollo: {
    city: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){slug name tags{slug title image} allTagsImage}}`,
      variables () {
        return {
          citySlug: this.citySlug
        }
      }
    }
  },
  components: {
    'sp-layout': Layout
  }
}
</script>
