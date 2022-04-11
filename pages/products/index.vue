<template>
  <div class="page-content products">
    <Title>Products:
      <ShopifyToggleEnv 
        :env="shopEnv"
        @change="toggleEnv" 
        />
    </Title>
    
    <template v-for="indexName in ['products_live', 'products_dev']">
      <AlgoliaSearch 
        v-if="indexName.includes(shopEnv)"
        :key="indexName"
        :index-name="indexName"
        :filtering="true"
        :selecting="false"
        :classes="{
          hit: 'col-span-12',
          card: 'p-2'
        }"
        :card-props="{ more: ['handle', 'tags'] }"
        card-style="media-left"
      />
    </template>
  </div>
</template>
<script>
import Vue from 'vue'
import {debounce} from 'lodash'
export default Vue.extend({
  props: {
    env: {
      type: String,
      default: 'live'
    }
  },
  data() {
    const shopEnv = (this.$route?.hash?.length ? this.$route.hash : this.env).replace('#', '').trim().toLowerCase() === 'dev' ? 'dev' : 'live';
    return { shopEnv }
  },
  watch: {
    '$route.hash': debounce(function(val) {
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
})
</script>