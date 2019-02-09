import Vue from 'vue'
import Router from 'vue-router'
import VueApollo from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import BootstrapVue from 'bootstrap-vue'
import VueHeadful from 'vue-headful'

import App from './App.vue'
import Layout from './Layout.vue'
import Timespan from './Timespan.vue'
import LinksToolbar from './LinksToolbar.vue'
import Cities from './Cities.vue'
import City from './City.vue'

Vue.use(Router)
Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.component('vue-headful', VueHeadful)

Vue.component('sp-layout', Layout)
Vue.component('sp-links-toolbar', LinksToolbar)

const apolloProvider = new VueApollo({
  defaultClient: createApolloClient({
    httpEndpoint: 'http://192.168.99.100:30072/graphql',
    persisting: false,
    websocketsOnly: false,
    ssr: false
  }).apolloClient,
  errorHandler (error) {
    console.log(error.message)
  }
})

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'cities',
      component: Cities
    },
    {
      path: '/:citySlug',
      name: 'city',
      component: City,
      props: true
    },
    {
      path: '/:citySlug/:timespan',
      name: 'timespan',
      component: Timespan,
      props: true
    }
  ]
})

new Vue({
  router,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
