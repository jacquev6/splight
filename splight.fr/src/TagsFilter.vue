<template>
  <b-row>
    <b-col>
      <b-button v-for="tag in tagsForDisplay" :key="tag.slug"
        :pressed="tag.pressed"
        :to="tag.to"
        :class="tag.clazz"
        active-class="sp-noop"
      >{{ tag.title }}</b-button>
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
        clazz: 'sp-btn-' + index + '-' + this.tags.length,
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
// @todo Import just the part we need from Bootstrap
@import "../node_modules/bootstrap/scss/bootstrap";

// @todo Generate classes for sizes 1 to N (and for index 1 to size) with N >= max number of tags in a single city
$sp-tag-colors: (
  "0-3": #f00,
  "1-3": #0f0,
  "2-3": #00f,
);

@each $suffix, $color in $sp-tag-colors {
  .sp-btn-#{$suffix} {
    @include button-variant(
      lighten($color, 50%), lighten($color, 20%), // Normal (background, border)
      lighten($color, 45%), lighten($color, 20%), // Hover (background, border)
      lighten($color, 40%), lighten($color, 20%), // Active (background, border)
    );
  }
}

</style>
