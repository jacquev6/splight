import Vue from 'vue'
import Router from 'vue-router'
import VueApollo from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import BootstrapVue from 'bootstrap-vue'
import VueHeadful from 'vue-headful'

import App from './App.vue'
import Index from './Index.vue'

Vue.use(Router)
Vue.use(VueApollo)
Vue.use(BootstrapVue)

const apolloProvider = new VueApollo({
  defaultClient: createApolloClient({
    httpEndpoint: 'http://localhost:8081/graphql',
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
      name: 'index',
      component: Index
    }
  ]
})

new Vue({
  router,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
