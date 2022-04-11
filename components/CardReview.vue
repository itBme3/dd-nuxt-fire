<template>
  <Card class="card-review"
    @click="copyReview()">
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
import Vue from 'vue'
import { decodeHtml } from '~/utils/funcs'
export default Vue.extend({
  props: {
    item: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      lastClick: 0
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
    decodeHtml,
    copyReview() {
      const clickTime = Date.now()
      if (Date.now() - this.lastClick < 1000) { 
        this.$copyText(`${this.title}\n${[...Array(this.item.score).keys()].map(() => `★`).join('')}\n"${this.content}"\n- ${this.item.name}\n\n${this.item?.product?.title ? `(on ${this.item.product.title})` : ''}`)
      }
      this.lastClick = clickTime
      
    }
  }
})
</script>

<style lang="scss">
.title {
  @apply my-6;
}
</style>