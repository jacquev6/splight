<template>
  <sp-layout :title="city.name + ' - Splight'" :lead="'Votre agenda culturel à ' + city.name + ' et dans sa région'">
    <template v-slot:subtitle>
      <span> - <router-link :to="{name: 'city', params: {citySlug}}">{{ city.name }}</router-link></span>
    </template>

    <template v-slot:content>
      <b-row><b-col>
        <p><router-link :to="weekLink()"><img class="img-fluid" alt="Toute l'actualité" :src="city.allTagsImage" /></router-link></p>
        <p><router-link :to="weekLink()">Toute l'actualité</router-link></p>
      </b-col></b-row>

      <b-row><b-col>
        <h1>Catégories</h1>
      </b-col></b-row>

      <b-row>
        <b-col v-for="tag in city.tags" :key="tag.slug" cols="6" md="3">
          <p><router-link :to="weekLink(tag)"><img class="img-fluid" :alt="tag.title" :src="tag.image" /></router-link></p>
          <p><router-link :to="weekLink(tag)">{{ tag.title }}</router-link></p>
        </b-col>
      </b-row>
    </template>
  </sp-layout>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      city: {}
    }
  },
  apollo: {
    city: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){name tags{slug title image} allTagsImage}}`,
      variables () {
        return {
          // @todo 404 if citySlug is wrong
          citySlug: this.citySlug
        }
      }
    }
  },
  methods: {
    weekLink (tag) {
      const startDate = moment().startOf('isoWeek')
      const base = {
        name: 'week',
        params: {
          citySlug: this.citySlug,
          year: startDate.format('GGGG'),
          week: startDate.format('WW')
        }
      }
      if (tag) {
        const query = {}
        query[tag.slug] = null
        return {
          ...base,
          query
        }
      } else {
        return base
      }
    }
  }
}
</script>
