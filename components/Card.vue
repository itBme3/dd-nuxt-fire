<template>
  <div 
    :class="{
      'card': true, 
      ['card-style-' + cardStyle]: true
    }"
    @mouseenter="$emit('mouseenter', true)"
    @mouseleave="$emit('mouseleave', true)"
    @click="(e) => $emit('click', e)"
    >
    <slot name="before" />
    <div class="card-inner"
      :class="{ [innerClasses]: true }">
      <div class="card-media"
        :class="{ [mediaClasses]: true }">
        <slot name="media" />
      </div>
      <div class="card-content"
        :class="{ [contentClasses]: true }">
        <slot />
      </div>
    </div>
    <slot name="after" />
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    cardStyle: {
      type: String,
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
  },
  data() {
    return {
      mediaClasses: typeof this.classes?.media === 'string' ? this.classes.media : '',
      contentClasses: typeof this.classes?.content === 'string' ? this.classes.content : '',
      innerClasses: typeof this.classes?.inner === 'string' ? this.classes.inner : '',
    }
  },
  watch: {
    classes(val) {
      this.mediaClasses = typeof val?.media === 'string' ? val.media : '';
      this.contentClasses = typeof val?.content === 'string' ? val.content : '';
    }
  }
})
</script>

<style lang="scss">
.card {
  @apply relative transition-all ease-quick-in duration-200 rounded bg-white bg-opacity-5 shadow-md overflow-hidden;
  .card-inner {
    @apply flex;
  }
  .card-media {
    @apply relative
  }
}
.card-style-overlay {
    .card-inner {
      @apply relative;
      .card-media {
        @apply relative z-1;
      }
      .card-content {
        @apply absolute top-1/2 transform -translate-y-1/2 left-4 right-4 z-10;
      }
      .card-title,
      .card-text * {
        @apply order-last;
        text-shadow: 0 0 40px rgba(0, 0, 0, 0.7);
      }
    }
  }
  .card-style-media-above {
    .card-inner {
      @apply flex-col;
      .card-content {
        @apply pt-2 px-4 pb-3;
      }
      .card-text {
        @apply px-4;
      }
      .card-media {
        @apply w-full;
      }
    }
  }
  .card-style-media-left {
    .card-inner {
      @apply flex items-center content-between;
      .card-content {
        @apply shrink-[2] mr-0 my-auto ml-[.75rem];
      }
      .card-media {
        @apply w-[calc(33.333%-.75rem)];
      }
    }
  }
  .card-style-media-right {
    .card-inner {
      @apply  items-center content-between;
      .card-content {
        @apply shrink-[2] mr-auto my-auto text-center;
      }
      .card-media {
        @apply ml-2 order-2 w-1/3;
      }
    }
  }
</style>

