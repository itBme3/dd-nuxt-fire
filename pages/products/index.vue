<template>
  <div class="page-content products">
    <Title>Products:</Title>
    <AlgoliaSearch :index-name="'products_live'" />
  </div>
</template>
<script>
const { colors, whitelist } = require('~/static/tw')
export default {
  mounted() {
    console.log({ colors, whitelist })
  }
}
</script>