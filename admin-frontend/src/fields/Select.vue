<template>
  <spa-base :title="title" :feedback="feedback">
    <b-select :options="options" :value="value" @input="$emit('input', $event)" :state="feedback.state">
      <template slot="first"><option :value="null">-</option></template>
    </b-select>
  </spa-base>
</template>

<script>
import Base from './Base.vue'

export default {
  components: {
    'spa-base': Base
  },
  props: {
    title: { required: true },
    feedback: { default () { return {} } },
    options: {},
    value: {}
  }
}
</script>
