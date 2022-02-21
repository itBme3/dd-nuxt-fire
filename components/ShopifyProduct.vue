<template>
  <div class="product"
    v-if="product !== null">
    
  </div>
</template>

<script>
export default {
  props: {
    handle: {
      type: String,
      default: null
    },
    env: {
      type: String,
      default: 'live'
    },
  }
}
</script>