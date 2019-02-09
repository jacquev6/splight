<template>
  <sp-layout :title="city.name + ' - Splight'" :lead="'Votre agenda culturel à ' + city.name + ' et dans sa région'">
    <template v-slot:subtitle>
      <span> - <router-link :to="{name: 'city', params: {citySlug}}">{{ city. name }}</router-link></span>
    </template>

    <template v-slot:content>
      <b-row class="d-lg-none">
        <b-col>
          <div class="sp-advertisement">
            <p>Publicité</p>
            <p><img class="img-fluid" alt="Publicité 468x60" src="../assets/ads/468x60.png" /></p>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <p>This is a timespan starting at {{ startDate }}, with duration {{ duration }}, and with tags {{ tags }}.</p>
          <p>{{ city }}</p>
        </b-col>

        <b-col lg="3" xl="2" class="d-none d-lg-inline-block">
          <div class="sp-advertisement">
            <p>Publicité</p>
            <p><img class="img-fluid" alt="Publicité 160x600" src="../assets/ads/160x600.png" /></p>
          </div>
        </b-col>
      </b-row>
    </template>
  </sp-layout>
</template>

<style>
  .sp-advertisement {
    color: gray;
    padding-bottom: 20px;
  }

  .sp-advertisement p {
    margin: 0;
    font-size: .8em;
  }
</style>

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
