<template>
  <spa-base :title="title" :feedback="feedback">
    <b-input :disabled="disabled" :value="value" @input="$emit('input', $event)" :state="feedback.state"/>
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
    disabled: { default: false },
    value: {}
  }
}
</script>
