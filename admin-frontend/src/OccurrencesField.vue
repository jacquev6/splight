<template>
  <spa-base title="Représentations" :feedback="feedback">
    <ul>
      <li v-for="occurrence in value" :key="occurrence.start">{{ occurrence.start }} <b-btn size="sm" @click="remove(occurrence)">Supprimer</b-btn></li>
    </ul>
    <b-input v-model="newStart" :state="feedback.state" placeholder="aaaa-mm-jjThh:mm"/>
    <b-btn size="sm" @click="add">Ajouter</b-btn>

  </spa-base>
</template>

<script>
import Base from './fields/Base.vue'

export default {
  components: {
    'spa-base': Base
  },
  props: {
    options: {},
    feedback: { default () { return {} } },
    value: {}
  },
  data () {
    return {
      newStart: ''
    }
  },
  methods: {
    remove (occurrence) {
      this.$emit('input', this.value.filter(o => o !== occurrence))
    },
    add () {
      this.$emit('input', Array.concat(this.value, [{ start: this.newStart }]))
      this.newStart = ''
    }
  }
}
</script>
