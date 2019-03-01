<template>
  <spa-layout v-if="city" :breadcrumbItems="breadcrumbItems">
    <h1>{{ city.event.title }}</h1>
    <spa-event-details :citySlug="citySlug" :eventId="eventId" saveButtonTitle="Enregistrer" @saved="$apollo.queries.city.refetch()"/>
  </spa-layout>
</template>

<script>
import gql from 'graphql-tag'

import EventDetails from './EventDetails.vue'

export default {
  components: {
    'spa-event-details': EventDetails
  },
  props: ['citySlug', 'eventId'],
  apollo: {
    city: {
      query: gql`query($citySlug:ID!,$eventId:ID!){city(slug:$citySlug){name event(id:$eventId){title}}}`,
      variables () {
        return {
          citySlug: this.citySlug,
          eventId: this.eventId
        }
      }
    }
  },
  computed: {
    breadcrumbItems () {
      return [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Villes', to: { name: 'cities' } },
        { text: this.city.name, to: { name: 'city', params: { citySlug: this.citySlug } } },
        { text: 'Événements', to: { name: 'events', params: { citySlug: this.citySlug } } },
        { text: this.city.event.title, to: { name: 'event', params: { citySlug: this.citySlug, eventId: this.eventId } } }
      ]
    }
  }
}
</script>
