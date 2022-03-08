<template>
  <Card class="card-product">
    <template #media
      v-if="!!item.image || !!item.media">
      <Media :media="!!item.image ? item.image : item.media" />
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
      type: String, // media-above media-left media-right
      default: 'media-above'
    }
  }
}
</script>