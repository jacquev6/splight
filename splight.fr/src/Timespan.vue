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
            <p><img class="img-fluid" alt="Publicité 468x60" src="./assets/ads/468x60.png" /></p>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <sp-links-toolbar :links="links" />
          <h1>{{ startDate.format(duration.titleFormat) }}</h1>
          <sp-tags-filter :tags="city.tags" />
          <p>This is timespan {{ timespan }}, from {{ startDate.format(moment.HTML5_FMT.DATE) }} to {{ dateAfter.format(moment.HTML5_FMT.DATE) }}, and with tags {{ tags }}.</p>
          <p>{{ city }}</p>
        </b-col>

        <b-col lg="3" xl="2" class="d-none d-lg-inline-block">
          <div class="sp-advertisement">
            <p>Publicité</p>
            <p><img class="img-fluid" alt="Publicité 160x600" src="./assets/ads/160x600.png" /></p>
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
import moment from 'moment'
import 'moment/locale/fr'

const durations = (function () {
  const oneDay = {
    days: 1,
    delta: 1,
    name: 'une journée',
    clip: 'day',
    titleFormat: '[Journée du] dddd LL',
    slugFormat: moment.HTML5_FMT.DATE,
    links: {
      prev: 'Journée précédente',
      next: 'Journée suivante',
      now1: { text: "Aujourd'hui", startDate: clipped => clipped },
      now2: { text: 'Demain', startDate: clipped => clipped.clone().add(1, 'day') }
    }
  }

  const threeDays = {
    days: 3,
    delta: 1,
    name: 'trois jours',
    clip: 'day',
    titleFormat: '[3 jours à partir du] dddd LL',
    slugFormat: moment.HTML5_FMT.DATE + '+2',
    links: {
      prev: 'Jours précédents',
      next: 'Jours suivants',
      now1: { text: 'Ces 3 jours', startDate: clipped => clipped },
      now2: { text: 'Le week-end prochain', startDate: clipped => clipped.clone().add(3, 'days').startOf('isoWeek').add(4, 'days') }
    }
  }

  const oneWeek = {
    days: 7,
    delta: 7,
    name: 'une semaine',
    clip: 'isoWeek',
    titleFormat: '[Semaine du] dddd LL',
    slugFormat: moment.HTML5_FMT.WEEK,
    links: {
      prev: 'Semaine précédente',
      next: 'Semaine suivante',
      now1: { text: 'Cette semaine', startDate: clipped => clipped },
      now2: { text: 'La semaine prochaine', startDate: clipped => clipped.clone().add(7, 'days') }
    }
  }

  return {
    all: [oneDay, threeDays, oneWeek],
    oneDay,
    threeDays,
    oneWeek
  }
})()

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    },
    timespan: {
      required: true
    }
  },
  data () {
    return {
      // @todo Remove (Display "loading" message to avoid accessing the undefined 'city' attribute)
      city: {
        tags: []
      },
      moment
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
          after: this.dateAfter.format('YYYY-MM-DD')
        }
      }
    }
  },
  computed: {
    tags () {
      return Object.keys(this.$route.query)
    },
    duration () {
      if (this.timespan[5] === 'W') {
        return durations.oneWeek
      } else if (this.timespan[10] === '+') {
        return durations.threeDays
      } else {
        return durations.oneDay
      }
    },
    startDate () {
      return moment.utc(this.timespan, this.duration.slugFormat, true)
    },
    dateAfter () {
      return this.startDate.clone().add(this.duration.days, 'days')
    },
    links () {
      return {
        // @todo Deactivate prev link on current week
        prev: {
          text: this.duration.links.prev,
          to: {
            name: 'timespan',
            params: {
              citySlug: this.citySlug,
              timespan: this.startDate.clone().subtract(this.duration.delta, 'days').format(this.duration.slugFormat)
            },
            query: this.$route.query
          }
        },
        // @todo Deactivate next link on week + 5
        next: {
          text: this.duration.links.next,
          to: {
            name: 'timespan',
            params: {
              citySlug: this.citySlug,
              timespan: this.startDate.clone().add(this.duration.delta, 'days').format(this.duration.slugFormat)
            },
            query: this.$route.query
          }
        },
        durations: durations.all.map(duration => ({
          name: duration.name,
          to: {
            name: 'timespan',
            params: {
              citySlug: this.citySlug,
              timespan: this.startDate.clone().startOf(duration.clip).format(duration.slugFormat)
            },
            query: this.$route.query
          }
        })),
        now1: {
          text: this.duration.links.now1.text,
          to: {
            name: 'timespan',
            params: {
              citySlug: this.citySlug,
              timespan: this.duration.links.now1.startDate(moment.utc().startOf(this.duration.clip)).format(this.duration.slugFormat)
            },
            query: this.$route.query
          }
        },
        now2: {
          text: this.duration.links.now2.text,
          to: {
            name: 'timespan',
            params: {
              citySlug: this.citySlug,
              timespan: this.duration.links.now2.startDate(moment.utc().startOf(this.duration.clip)).format(this.duration.slugFormat)
            },
            query: this.$route.query
          }
        }
      }
    }
  }
}
</script>
