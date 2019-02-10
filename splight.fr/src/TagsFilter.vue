<template>
  <b-row>
    <b-col>
      <template v-for="tag in tagsForDisplay">
        <b-button :key="tag.slug"
          :pressed="tag.pressed"
          :to="tag.to"
          :class="tag.clazz"
          active-class="sp-noop"
        >{{ tag.title }}</b-button>{{ ' ' }}
      </template>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    tags: {
      required: true
    }
  },
  data () {
    return {
      myToggle: false
    }
  },
  computed: {
    allTagSlugs () {
      return new Set(this.tags.map(({ slug }) => slug))
    },
    activeTagSlugs () {
      return new Set(Object.keys(this.$route.query).filter(slug => this.allTagSlugs.has(slug)))
    },
    allTagsAreActive () {
      const size = this.activeTagSlugs.size
      return size === 0 || size === this.allTagSlugs.size
    },
    tagsForDisplay () {
      const view = this

      function toggle (slug) {
        const newActiveTagSlugs = new Set(view.activeTagSlugs)
        if (newActiveTagSlugs.has(slug)) {
          newActiveTagSlugs.delete(slug)
        } else {
          newActiveTagSlugs.add(slug)
        }
        const query = { ...view.$route.query }
        view.allTagSlugs.forEach(function (slug) {
          delete query[slug]
        })
        if (newActiveTagSlugs.size !== view.allTagSlugs.size) {
          newActiveTagSlugs.forEach(function (slug) {
            query[slug] = null
          })
        }
        return query
      }

      return this.tags.map(({ slug, title }, index) => ({
        slug,
        title,
        clazz: 'sp-btn-' + (index + 1) + '-' + this.tags.length,
        pressed: this.allTagsAreActive || this.activeTagSlugs.has(slug),
        to: {
          path: this.$route.path,
          query: toggle(slug)
        }
      }))
    }
  }
}
</script>

<style scoped lang="scss">
@import "../node_modules/bootstrap/scss/functions";
@import "../node_modules/bootstrap/scss/variables";
@import "../node_modules/bootstrap/scss/mixins/hover";
@import "../node_modules/bootstrap/scss/mixins/buttons";
@import "../node_modules/bootstrap/scss/mixins/box-shadow";
@import "../node_modules/bootstrap/scss/mixins/gradients";

@for $size from 1 through 30 {
  @for $index from 1 through $size {
    $color: hsl(($index - 1) / $size * 360, 100%, 50%);

    .sp-btn-#{$index}-#{$size} {
      @include button-variant(
        lighten($color, 50%), lighten($color, 20%), // Normal (background, border)
        lighten($color, 45%), lighten($color, 20%), // Hover (background, border)
        lighten($color, 40%), lighten($color, 20%), // Active (background, border)
      );
    }
  }
}
</style>
