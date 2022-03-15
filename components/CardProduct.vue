<template>
  <Card 
    class="card-product"
    :card-style="cardStyle"
    :classes="classes"
  >
    <template v-if="!!item.image || !!item.media"
      #media>
      <Media :media="!!item.image ? typeof item.image === 'string' ? {src: item.image} : item.image : typeof item.media === 'string' ? {src: item.media} : item.media" />
    </template>
    <h3 class="title">{{ item.title }}</h3>
  </Card>
</template>

<script>
export default {
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
    }
  }
}
</script>