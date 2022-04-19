<template>
  <gButton
    class="mt-2"
    @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'">
    <Icon :name="$colorMode.preference === 'light' ? 'light' : 'dark'" /> <small>{{ $colorMode.preference === 'light' ? 'light' : 'dark' }}</small>
  </gButton>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    onMount() {
      if(this.$colorMode.preference !== 'dark') {
        this.$colorMode.preference = 'dark'
      }
    },
    methods: {
      changeColorMode(e) {
        this.$colorMode.preference = e
      }
    }
  })
</script>

<style scoped>

</style>