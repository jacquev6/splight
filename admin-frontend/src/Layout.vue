<template>
  <b-container v-if="viewer">
    <template v-if="viewer.authenticated">
      <b-row>
        <b-col><b-breadcrumb :items="breadcrumbItems"/></b-col>
        <b-col cols="2"><b-btn variant="secondary" @click="logout">Déconnexion ({{ viewer.authenticated.name }})</b-btn></b-col>
      </b-row>
      <slot/>
    </template>
    <template v-else>
      <b-breadcrumb :items="loginBreadcrumbItems"/>
      <h1>Identification</h1>
      <spa-input-field title="Login" v-model="username"/>
      <b-row><b-col><b-btn variant="primary" :disabled="!enabled" @click="login">Connexion</b-btn></b-col></b-row>
    </template>
  </b-container>
</template>

<script>
/* global splightApiUrl */

import axios from 'axios'
import gql from 'graphql-tag'

import Fields from './fields'

export default {
  components: {
    ...Fields
  },
  props: ['breadcrumbItems'],
  data () {
    return {
      username: '',
      loginBreadcrumbItems: [
        { text: 'Admin', to: { name: 'root' } },
        { text: 'Identification' }
      ]
    }
  },
  apollo: {
    viewer: gql`query{viewer{authenticated{name}}}`
  },
  computed: {
    enabled () {
      return this.username !== ''
    }
  },
  methods: {
    async login () {
      axios.post(splightApiUrl + '/../login', { username: this.username }, { withCredentials: true }).then(response => {
        this.$apollo.queries.viewer.refetch()
      })
    },
    async logout () {
      axios.post(splightApiUrl + '/../login', {}, { withCredentials: true }).then(response => {
        this.$apollo.queries.viewer.refetch()
      })
    }
  }
}
</script>
