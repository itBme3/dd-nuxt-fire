<template>
  <Card class="card-review">
    <div class="stars flex content-start items-center">
      <Icon v-for="i in [1,2,3,4,5]"
        :key="item.id + '-' + i"
        :name="i <= item.score ? 'star-full' : 'star-o'"
        style="margin-left: .013em"
        :class="{
          'text-yellow-600 dark:text-yellow-400': i <= item.score,
          'text-gray-400 dark:text-gray-600': i > item.score,
        }"
      />
    </div>
    <h3 class="title" v-html="title" />
    <p class="content" v-html="content" />
  </Card>
</template>

<script>
import { decodeHtml } from '~/utils/funcs'
export default {
  props: {
    item: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    title() {
      if(this.item._highlightResult.title.matchedWords.length === 0) return decodeHtml(this.item.title)
      return decodeHtml(this.item._highlightResult.title.value.split('<em>').join('___HIGHLIGHT___').split('</em>').join('___ENDHIGHLIGHT___')).split('___HIGHLIGHT___').join('<em>').split('___ENDHIGHLIGHT___').join('</em>')
    },
    content() {
      if(this.item._highlightResult.content.matchedWords.length === 0) return decodeHtml(this.item.content)
      return decodeHtml(this.item._highlightResult.content.value.split('<em>').join('___HIGHLIGHT___').split('</em>').join('___ENDHIGHLIGHT___')).split('___HIGHLIGHT___').join('<em>').split('___ENDHIGHLIGHT___').join('</em>')
    }
  },
  methods: {
    decodeHtml
  }
}
</script>

<style lang="scss">
.title {
  @apply mt-2 mb-1;
}
</style>