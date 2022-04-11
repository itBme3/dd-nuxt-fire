<template>
  <div class="expansion-group">
    <slot ref="expansionPanels" />
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    expandedIndex: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      expanded: this.expandedIndex
    }
  },
  watch: {
    expandedIndex(val) {
      this.expanded = val
    }
  },
  mounted() {
    console.log({ this: this })
  },
})
</script>
