import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Cities from './views/Cities.vue'
import City from './views/City.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
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

const app = new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
