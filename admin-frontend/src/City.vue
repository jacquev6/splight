<template>
  <spa-layout v-if="city" :breadcrumbItems="breadcrumbItems">
    <h1>{{ city.name }}</h1>
    <b-row>
      <b-col><h2><router-link :to="{name: 'locations', params: {citySlug}}">Lieux</router-link></h2></b-col>
      <!-- <b-col><h2><router-link :to="{name: 'events', params: {citySlug}}">Événements</router-link></h2></b-col> -->
    </b-row>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    }
  },
  apollo: {
    city: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){name}}`,
      variables () {
        return {
          citySlug: this.citySlug
        }
      }
    }
  },
  computed: {
    breadcrumbItems () {
      return [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Villes', to: { name: 'cities' } },
        { text: this.city.name, to: { name: 'city', params: { citySlug: this.citySlug } } }
      ]
    }
  }
}
</script>
