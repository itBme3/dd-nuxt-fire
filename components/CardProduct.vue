<template>
  <Card 
    class="card-product"
    :card-style="cardStyle"
    :class="{
      ['' + classes.card + '']: typeof classes.card === 'string'
    }"
    :classes="cardClasses"
  >
    <template 
      v-if="!!item.image || !!item.media"
      #media>
      <Media
        class="rounded"
        :media="!!item.image ? typeof item.image === 'string' ? {src: item.image} : item.image : typeof item.media === 'string' ? {src: item.media} : item.media" />
    </template>
    <h3 class="product-title mb-1 mt-auto">{{ item.title }}</h3>
    <template v-for="key in ['handle', 'product_type']">
      <small 
        v-if="showingMore.includes(key) && item[key]"
        :key="key"
        class="product-handle text-gray-300 dark:text-gray-600 text-xs">
        {{ item[key] }}
      </small>
    </template>
    <template v-if="showingMore.includes('tags')">
      <div class="tags-list flex flex-wrap items-start content-start mt-2 mb-auto">
        <span
          v-for="tag in tags"
          :key="tag"
          class="product-tag">
          {{ tag }}
        </span>
      </div>
    </template>
  </Card>
</template>

<script>

import Vue from 'vue';

export default Vue.extend({
  props: {
    item: {
      type: Object,
      default: () => null
    },
    cardStyle: {
      type: String, /* 'media-above' | 'media-left' | 'media-right' */
      default: 'media-above'
    },
    classes: {
      type: Object,
      default: () => {
        return {
          card: '',
          media: '',
          title: '',
          content: ''
        }
      }
    },
    more: {
      type: Array,
      default: () => [ /* 'tags', 'handle', 'product_type' */ ]
    }
  },
  computed: {
    tags() {
      return Array.isArray(this.item?.tags)
        ? this.item.tags
        : typeof this.item?.tags === 'string' 
          ? this.item.tags.split(', ')
          : []
    },
    showingMore() {
      return Array.isArray(this.more) ? this.more : []
    },
    cardClasses() {
      const { 
        title = '', 
        content = 'my-auto',
        media = ['media-left', 'media-right'].includes(this.cardStyle) && this.showingMore.includes('tags') ? 'w-[45%] mt-0 max-w-[10rem]' : '', 
        inner = ['media-left', 'media-right'].includes(this.cardStyle) ? 'items-start' : ''
      } = this.classes;
      return { media, title, content, inner }
    }
  }
})
</script>

<style lang="scss">
.product-tag {
  @apply rounded py-1 px-2 text-xs text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-30 bg-opacity-30 mr-1 mb-1;
}
</style>