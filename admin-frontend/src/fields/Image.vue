<template>
  <spa-base :title="title" :feedback="feedback">
    <template v-if="value === null">
      <b-file @change="set" :state="feedback.state"/>
    </template>
    <template v-else>
      <b-img fluid :src="value"/>
      <b-btn @click="$emit('input', null)">Modifier</b-btn>
    </template>
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
  },
  methods: {
    set (change) {
      const reader = new FileReader()
      reader.onload = e => {
        this.$emit('input', e.target.result)
      }
      reader.readAsDataURL(change.target.files[0])
    }
  }
}
</script>
