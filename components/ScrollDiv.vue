<template>
  <scrollbar
    :class="{
      'overflow-y-scroll': !!!options.suppressScrollY,
      'overflow-x-scroll': !!!options.suppressScrollX,
      'overflow-y-hidden': !!options.suppressScrollY,
      'overflow-x-hidden': !!options.suppressScrollX
    }"
      :options="options"
      @ps-scroll-x="(e) => scrollHandler(e, 'scroll-x')"
      @ps-scroll-y="(e) => scrollHandler(e, 'scroll-y')"
      @ps-scroll-up="(e) => scrollHandler(e, 'scroll-up')"
      @ps-scroll-down="(e) => scrollHandler(e, 'scroll-down')"
    >
    <slot />
  </scrollbar>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return { suppressScrollY: false, suppressScrollX: true }
      }
    }
  },
  methods: {
    scrollHandler(event, eventName) {
      console.log({scrollHeight: event.srcElement.scrollHeight, scrollTop: event.srcElement.scrollTop, scrElement: event.scrElement, event});
      const { srcElement } = event;
      if (srcElement.scrollHeight - (srcElement.scrollTop + srcElement.offsetHeight) < 100) {
        const windowScrollY = window.scrollY * 1;
        window.scrollTo({ top:windowScrollY === 0 ? 1 : windowScrollY + 1 })
        window.scrollTo({ top: windowScrollY - 1 })
      }
      this.$emit('onScroll', { event, eventName })
      return { e: event, eventName }
    }
  }
}
</script>