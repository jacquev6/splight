<template>
  <div>
    <b-jumbotron lead="Votre agenda culturel régional">
      <template slot="header">
        <router-link :to="{name: 'cities'}">Splight</router-link>
        <slot name="subtitle"></slot>
      </template>
    </b-jumbotron>

    <slot name="content"></slot>
  </div>
</template>
