<template>
  <sp-layout :title="city.name + ' - Splight'" :lead="'Votre agenda culturel à ' + city.name + ' et dans sa région'">
    <template v-slot:subtitle>
      <span> - <router-link :to="{name: 'city', params: {citySlug}}">{{ city. name }}</router-link></span>
    </template>

    <template v-slot:content>
      <p>This is a timespan starting at {{ startDate }}, with duration {{ duration }}, and with tags {{ tags }}.</p>
      <p>{{ city }}</p>
    </template>
  </sp-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    },
    startDate: {
      required: true
    },
    duration: {
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
      query: gql`query($citySlug:ID!,$first:Date!,$after:Date!){
        city(slug:$citySlug){
          slug
          name
          tags{slug title}
          firstDate
          events(dates:{start:$first, after:$after}){
            id
            title
            tags{slug title}
            artist{name description website image}
            location{name description website image phone address}
            occurrences{start}
            reservationPage
          }
        }
      }`,
      variables () {
        return {
          // @todo 404 if citySlug is wrong
          citySlug: this.citySlug,
          first: this.startDate.format('YYYY-MM-DD'),
          after: this.startDate.clone().add(this.duration, 'days').format('YYYY-MM-DD')
        }
      }
    }
  },
  computed: {
    tags () {
      return Object.keys(this.$route.query)
    }
  }
}
</script>
