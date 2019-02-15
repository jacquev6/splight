<template>
  <div v-if="validateEvent">
    <spa-input-field title="Titre" v-model="event.title" :feedback="feedback.title"/>
    <spa-select-field title="Artiste" :options="artistOptions" v-model="event.artist" :feedback="feedback.artist"/>
    <spa-select-field title="Lieu" :options="locationOptions" v-model="event.location" :feedback="feedback.location"/>
    <spa-tags-field :options="tagOptions" v-model="event.tags" :feedback="feedback.tags"/>
    <spa-occurrences-field v-model="event.occurrences" :feedback="feedback.occurrences"/>
    <spa-input-field title="Site de réservation" v-model="event.reservationPage" :feedback="feedback.reservationPage"/>
    <b-row><b-col><b-btn variant="primary" :disabled="!enabled" @click="save">{{ saveButtonTitle }}</b-btn></b-col></b-row>
  </div>
</template>

<script>
import gql from 'graphql-tag'

import Fields from './fields'
import TagsField from './TagsField.vue'
import OccurrencesField from './OccurrencesField.vue'

export default {
  components: {
    ...Fields,
    'spa-tags-field': TagsField,
    'spa-occurrences-field': OccurrencesField
  },
  props: {
    citySlug: {},
    eventId: {},
    saveButtonTitle: {}
  },
  data () {
    return {
      event: this.makeEvent()
    }
  },
  apollo: {
    artistOptions: {
      query: gql`{artists{slug name}}`,
      update (data) {
        return data.artists.map(({ slug, name }) => ({ value: slug, text: name }))
      }
    },
    locationOptions: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){locations{slug name}}}`,
      variables () {
        return {
          citySlug: this.citySlug
        }
      },
      update (data) {
        return data.city.locations.map(({ slug, name }) => ({ value: slug, text: name }))
      }
    },
    tagOptions: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){tags{slug title}}}`,
      variables () {
        return {
          citySlug: this.citySlug
        }
      },
      update (data) {
        return data.city.tags.map(({ slug, title }) => ({ value: slug, text: title }))
      }
    },
    validateEvent: {
      query: gql`query($forInsert:Boolean!,$citySlug:ID!,$event:IEvent!){validateEvent(forInsert:$forInsert,citySlug:$citySlug,event:$event){id title artist location tags occurrences reservationPage}}`,
      variables () {
        return {
          forInsert: !this.eventId,
          citySlug: this.citySlug,
          event: { ...this.event } // To be reactive to each field
        }
      },
      skip () {
        return !this.event
      }
    },
    initialEvent: {
      query: gql`query($citySlug:ID!,$eventId:ID!){city(slug:$citySlug){name event(id:$eventId){id title artist{slug} location{slug} tags{slug} occurrences{start} reservationPage}}}`,
      variables () {
        return {
          citySlug: this.citySlug,
          eventId: this.eventId
        }
      },
      manual: true,
      result ({ data, loading }) {
        if (!loading) {
          const { id, title, artist, location, tags, occurrences, reservationPage } = data.city.event
          this.event = {
            id,
            title,
            artist: artist.slug,
            location: location.slug,
            tags: tags.map(({ slug }) => slug),
            occurrences: occurrences.map(({ start }) => ({ start })),
            reservationPage
          }
        }
      },
      skip () {
        return !this.eventId
      }
    }
  },
  methods: {
    makeEvent () {
      if (this.eventId) {
        return null
      } else {
        return {
          id: null,
          title: null,
          artist: null,
          location: null,
          tags: [],
          occurrences: [],
          reservationPage: null
        }
      }
    },
    save () {
      this.$apollo.mutate({
        mutation: gql`mutation($citySlug:ID!,$event:IEvent!){putEvent(citySlug:$citySlug,event:$event){id}}`,
        variables: {
          citySlug: this.citySlug,
          event: this.event
        }
      // @todo Catch errors, provide feedback and don't erase the form. Same for events and locations
      // @todo Factorize the common logic in XxxDetails somehow
      }).then(() => {
        if (!this.eventId) {
          this.event = this.makeEvent()
        }
        this.$emit('saved')
      })
    }
  },
  computed: {
    validating () {
      if (!this.event) return false
      const { id, title, artist, location, tags, occurrences, reservationPage } = this.event
      return id || title || artist || location || tags.length || occurrences.length || reservationPage
    },
    enabled () {
      if (!this.validateEvent) return false
      const { id, title, artist, location, tags, occurrences, reservationPage } = this.validateEvent
      return this.validating && !(id || title || artist || location || tags || occurrences || reservationPage)
    },
    feedback () {
      return {
        id: {
          state: this.validating ? !this.validateEvent.id : null,
          invalid: this.validateEvent.id
        },
        title: {
          state: this.validating ? !this.validateEvent.title : null,
          invalid: this.validateEvent.title
        },
        artist: {
          state: this.validating ? !this.validateEvent.artist : null,
          invalid: this.validateEvent.artist
        },
        location: {
          state: this.validating ? !this.validateEvent.location : null,
          invalid: this.validateEvent.location
        },
        tags: {
          state: this.validating ? !this.validateEvent.tags : null,
          invalid: this.validateEvent.tags
        },
        occurrences: {
          state: this.validating ? !this.validateEvent.occurrences : null,
          invalid: this.validateEvent.occurrences
        },
        reservationPage: {
          state: this.validating ? !this.validateEvent.reservationPage : null,
          invalid: this.validateEvent.reservationPage
        }
      }
    }
  }
}
</script>
