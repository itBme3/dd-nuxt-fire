<template>
  <Card v-if="!!mediaItem"
    :class="{
      'p-0': true
    }"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    >
    <template v-if="!!mediaItem.downloadUrl || !!mediaItem.image || !!mediaItem.image"
      #media>
      <Media :media="!!mediaItem.downloadUrl ? mediaItem : !!mediaItem.image ? mediaItem.image : mediaItem.media" >
        <img v-if="mediaItem.downloadUrl && hovering" :src="mediaItem.downloadUrl" class="absolute inset-0 z-10" />
      </Media>
    </template>
    <template #after>
      <SelectStarRating 
        :value="typeof item.rating === 'number' ? item.rating : 0"
        @change="(e) => updateRating(e)"
      />
    </template>
  </Card>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    item: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      mediaItem: this.item,
      hovering: false
    }
  },
  watch: {
    item() {
      this.mediaItem = this.item
    }
  },
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    window.addEventListener('keydown', (e) => {
      if (!this.hovering || !('0,1,2,3,4,5'.split(',')).includes(e.key)) return null;
      this.updateRating(parseInt(e.key)).catch(err => alert(err.message))
    });
  },
  methods: {
    async updateRating(val) {
      this.mediaItem.rating = val;
      const docRef = this.$fire.firestore.collection('media').doc(this.mediaItem.objectID);
      return await docRef.set({ rating: this.mediaItem.rating }, {merge: true})
    }
  }
})
</script>