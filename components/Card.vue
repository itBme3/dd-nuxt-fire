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
    <div class="card-media"
      :class="{ [mediaClasses]: true }">
      <slot name="media" />
    </div>
    <div class="card-content"
      :class="{ [contentClasses]: true }">
      <slot />
    </div>
    <slot name="after" />
  </div>
</template>

<script>
const defaultClasses = {
  media: '',
  content: ''
};

export default {
  props: {
    cardStyle: {
      type: String,
      default: 'media-above'
    },
    classes: {
      type: Object,
      default: () => defaultClasses
    }
  },
  data() {
    return {
      mediaClasses: typeof this.classes?.media === 'string' ? this.classes.media : defaultClasses.media,
      contentClasses: typeof this.classes?.content === 'string' ? this.classes.content : defaultClasses.content,
    }
  },
  watch: {
    classes(val) {
      this.mediaClasses = typeof val?.media === 'string' ? val.media : defaultClasses.media;
      this.contentClasses = typeof val?.content === 'string' ? val.content : defaultClasses.content;
    }
  }
}
</script>

<style lang="scss">
.card {
  @apply relative flex transition-all ease-quick-in duration-200 rounded bg-white bg-opacity-5 shadow-md overflow-hidden;
  .card-media {
    @apply relative
  }
}
.card-style-overlay {
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
  .card-style-media-above {
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
  .card-style-media-left {
    @apply items-center content-between;
    .card-content {
      @apply mr-auto w-2/3;
    }
    .card-media {
      @apply mr-[.75rem] w-[calc(33.333%-.75rem)];
    }
  }
  .card-style-media-right {
    @apply items-center content-between;
    .card-content {
      @apply mr-auto w-2/3 text-center;
    }
    .card-media {
      @apply ml-2 order-2 w-1/3;
    }
  }
</style>

