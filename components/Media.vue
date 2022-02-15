<template>
  <div
    v-if="typeof mediaSrc === 'string'"
    :style="{ 
      height: imgHeight,
      backgroundImage: isBackground && typeof mediaSrc === 'string' && mediaSrc.length > 0 ? 'url(' + mediaSrc + ')' : 'none' }"
    class="media overflow-hidden relative flex items-center justify-center"
    style="background-repeat: no-repeat; background-size: cover; background-position: center;"
  >
    <template v-if="typeof mediaSrc === 'string'">
      <img :src="mediaSrc"
        class="media-image w-full h-auto relative z-0"
        :class="{ 'opacity-0': isBackground }"
        @load="imageLoaded"
      >
    </template>
  </div>
</template>

<script lang="js">
import { getThumbImageUrl } from '~/utils/funcs'

export default {
  props: {
    media: {
      default: () => null
    },
    ratio: {
      type: String,
      default: 'auto'
    },
    isBackground: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const mediaSrc = typeof this.mediaSrc !== 'undefined' ? this.mediaSrc : this.getImgSrc(this.media, typeof this.$el !== 'undefined' ? this.$el : { offsetWidth: 300, offsetHeight: 300 })
    return { mediaSrc, imgHeight: 'auto' }
  },
  mounted () {
    this.setImgSrc()
    window.addEventListener('resize', this.setImgSrc)
  },
  unmounted () {
    window.removeEventListener('resize', this.setImgSrc)
  },
  methods: {
    imageLoaded () {
      this.setImgSrc()
    },
    setImgSrc () {
      this.setImgHeight()
      const mediaSrc = this.getImgSrc(this.media, typeof this.$el !== 'undefined' ? this.$el : { offsetWidth: 300, offsetHeight: 300 })
      if (this.mediaSrc === mediaSrc) {
        return
      };
      this.mediaSrc = mediaSrc
    },
    getImgSrc (media, el) {
      if (media === null) {
        return null
      }
      const thumb = getThumbImageUrl(media, el)
      if (typeof thumb === 'undefined') {
        return null
      }
      return thumb
    },
    setImgHeight () {
      if (typeof this.ratio !== 'string' || !this.ratio.includes || !this.ratio.includes(':') || typeof this.$el === 'undefined' || this.$el.offsetWidth < 0) {
        return
      }
      const ratio = this.ratio.split(':')
      const width = this.$el.offsetWidth
      const height = Math.floor(width / ratio[0] * ratio[1])
      if (height > 0 && this.imgHeight !== `${height}px`) {
        this.imgHeight = `${height}px`
        return
      }
      if (this.imgHeight === `${height}px`) {
        return
      }
      this.imgHeight = 'auto'
    }
  }
}
</script>

<style lang="scss">
.overlay {
  @apply bg-opacity-5;
}
</style>
