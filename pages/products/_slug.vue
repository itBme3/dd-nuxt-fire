<template>
  <div class="product-page">
    <ShopifyToggleEnv 
      :env="shopEnv"
      @change="toggleEnv" 
    />
    {{ shopEnv }}
  </div>
</template>

<script>
export default {
  data() {
    const shopEnv = (this.$route?.hash?.length ? this.$route.hash : 'live').replace('#', '').trim().toLowerCase() === 'dev' ? 'dev' : 'live';
    return { shopEnv }
  },
  watch: {
    '$route.hash': _.debounce(function(val) {
      if(this.$route.hash.replace('#', '') === this.shopEnv) return;
      this.toggleEnv(val)
    }, 250)
  },
  methods: {
    toggleEnv(env) {
      this.togglingEnv = true
      this.shopEnv = env.replace('#', '').trim().toLowerCase() === 'dev' ? 'dev' : 'live'
      this.$router.push({ path: this.$route.path, query: this.$route.query, hash: this.shopEnv })
      setTimeout(() => {
        this.togglingEnv = false
      }, 250)
    }
  }
}
</script>