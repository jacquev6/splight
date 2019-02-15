<template>
  <spa-base title="Catégories" :feedback="feedback">
    <b-select :options="options" v-model="mainTag" :state="feedback.state">
      <template slot="first"><option :value="null">-</option></template>
    </b-select>
    <b-form-checkbox-group v-if="mainTag" v-model="secondaryTags" :options="secondaryOptions"/>
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
    if (this.value.length) {
      // @todo Factorize with this.watch.value
      return {
        mainTag: this.value[0],
        secondaryTags: this.value.splice(1)
      }
    } else {
      return {
        mainTag: null,
        secondaryTags: []
      }
    }
  },
  watch: {
    mainTag () {
      this.secondaryTags = this.secondaryTags.filter(tag => tag !== this.mainTag)
    },
    secondaryTags () {
      this.$emit('input', this.newValue)
    },
    value () {
      if (JSON.stringify(this.value) !== JSON.stringify(this.newValue)) {
        if (this.value.length) {
          this.mainTag = this.value[0]
          this.secondaryTags = this.value.slice(1)
        } else {
          this.mainTag = null
          this.secondaryTags = []
        }
      }
    }
  },
  computed: {
    secondaryOptions () {
      return this.options.map(({ value, text }) => ({ value, text, disabled: !this.mainTag || value === this.mainTag }))
    },
    newValue () {
      if (this.mainTag) {
        return Array.concat([this.mainTag], this.secondaryTags)
      } else {
        return []
      }
    }
  }
}
</script>
