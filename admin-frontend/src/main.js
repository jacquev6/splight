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
import Locations from './Locations.vue'
import Location from './Location.vue'
import Events from './Events.vue'
import Event from './Event.vue'
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
      component: Locations,
      props: true
    },
    {
      path: '/cities/:citySlug/locations/:locationSlug',
      name: 'location',
      component: Location,
      props: true
    },
    {
      path: '/cities/:citySlug/events',
      name: 'events',
      component: Events,
      props: true
    },
    {
      path: '/cities/:citySlug/events/:eventId',
      name: 'event',
      component: Event,
      props: true
    }
  ]
})

new Vue({
  router,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
