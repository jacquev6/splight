import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Index from './views/Index.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    }
  ]
})

const app = new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
