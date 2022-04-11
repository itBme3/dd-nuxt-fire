<template>
  <h3 class="text-2xl mb-5">
    {{ title }}
  </h3>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
})
</script>
