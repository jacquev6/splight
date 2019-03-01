/* global splightApiUrl */

// @todo Have a look at https://jestjs.io/

import Vue from 'vue'
import Router from 'vue-router'
import VueApollo from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Artist from './Artist.vue'
import Artists from './Artists.vue'
import Cities from './Cities.vue'
import City from './City.vue'
import CityLocations from './CityLocations.vue'
import CityLocation from './CityLocation.vue'
import CityEvents from './CityEvents.vue'
import CityEvent from './CityEvent.vue'
import Layout from './Layout.vue'
import Root from './Root.vue'

Vue.use(Router)
Vue.use(VueApollo)
Vue.use(BootstrapVue)

Vue.component('spa-layout', Layout)

const apolloProvider = new VueApollo({
  // https://github.com/Akryum/vue-cli-plugin-apollo/blob/b99182283eeb8ea49336bb1617a309269d32dc8b/graphql-client/src/index.js#L14
  defaultClient: createApolloClient({
    httpEndpoint: splightApiUrl + 'graphql',
    persisting: false,
    websocketsOnly: false,
    ssr: false,
    httpLinkOptions: {
      credentials: 'include' // https://www.apollographql.com/docs/react/recipes/authentication.html
    }
  }).apolloClient,
  defaultOptions: {
    $query: {
      fetchPolicy: 'no-cache'
    }
  },
  errorHandler (error) {
    console.log(error.message)
  }
})

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'root',
      component: Root
    },
    {
      path: '/artists',
      name: 'artists',
      component: Artists
    },
    {
      path: '/artists/:artistSlug',
      name: 'artist',
      component: Artist,
      props: true
    },
    {
      path: '/cities',
      name: 'cities',
      component: Cities
    },
    {
      path: '/cities/:citySlug',
      name: 'city',
      component: City,
      props: true
    },
    {
      path: '/cities/:citySlug/locations',
      name: 'locations',
      component: CityLocations,
      props: true
    },
    {
      path: '/cities/:citySlug/locations/:locationSlug',
      name: 'location',
      component: CityLocation,
      props: true
    },
    {
      path: '/cities/:citySlug/events',
      name: 'events',
      component: CityEvents,
      props: true
    },
    {
      path: '/cities/:citySlug/events/:eventId',
      name: 'event',
      component: CityEvent,
      props: true
    }
  ]
})

new Vue({
  router,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
