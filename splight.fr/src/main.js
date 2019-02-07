import Vue from 'vue'
import Router from 'vue-router'
import VueApollo from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import BootstrapVue from 'bootstrap-vue'
import VueHeadful from 'vue-headful'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import Cities from './views/Cities.vue'
import City from './views/City.vue'
import Layout from './components/Layout.vue'

Vue.use(Router)
Vue.use(VueApollo)
Vue.use(BootstrapVue)
Vue.component('vue-headful', VueHeadful)

Vue.component('sp-layout', Layout)

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
    }
  ]
})

new Vue({
  router,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
