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
import ArtistsList from './ArtistsList.vue'
import Layout from './Layout.vue'
import Root from './Root.vue'

Vue.use(Router)
Vue.use(VueApollo)
Vue.use(BootstrapVue)

Vue.component('spa-layout', Layout)
Vue.component('spa-artists-list', ArtistsList)

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
    }
  ]
})

new Vue({
  router,
  apolloProvider,
  render: function (h) { return h(App) }
}).$mount('#app')
