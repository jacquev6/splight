import Vue from 'vue'
import Router from 'vue-router'
import VueApollo from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import BootstrapVue from 'bootstrap-vue'
import VueHeadful from 'vue-headful'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Layout from './components/Layout.vue'
import Timespan from './components/Timespan.vue'
import Cities from './views/Cities.vue'
import City from './views/City.vue'
import Week from './views/Week.vue'
import ThreeDays from './views/ThreeDays.vue'
import Day from './views/Day.vue'

Vue.use(Router)
Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.component('vue-headful', VueHeadful)

Vue.component('sp-layout', Layout)
Vue.component('sp-timespan', Timespan)

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
      path: '/:citySlug/:year(\\d\\d\\d\\d)-W:week(\\d\\d)',
      name: 'week',
      component: Week,
      props: true
    },
    {
      path: '/:citySlug/:year(\\d\\d\\d\\d)-:month(\\d\\d)-:day(\\d\\d)\\+2',
      name: 'threeDays',
      component: ThreeDays,
      props: true
    },
    {
      path: '/:citySlug/:year(\\d\\d\\d\\d)-:month(\\d\\d)-:day(\\d\\d)',
      name: 'day',
      component: Day,
      props: true
    }
  ]
})

new Vue({
  router,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
