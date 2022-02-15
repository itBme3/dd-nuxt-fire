<template>
  <div class="page-content products">
    <Title>Products:
      <div
        class="buttons float-right flex text-xs nowrap items-center justify-end py-2 space-x-2">
          <gButton  
            v-for="indexName in ['products_live', 'products_dev']"
            :key="indexName"
            :class="{
              ['hover:text-gray-900 uppercase']: true,
              ['hover:bg-blue-400']: indexName.includes('dev'),
              ['hover:bg-green-400']: indexName.includes('live'),
              ['bg-blue-400']: indexName.includes('dev') && shopEnv === 'dev',
              ['bg-green-400']: indexName.includes('live') && shopEnv === 'live',
              ['text-gray-900']: indexName.includes(shopEnv)
            }"
            @click="() => toggleEnv(indexName.replace('products_', ''))">{{ indexName.replace('products_', '') }}</gButton>
      </div>
    </Title>
    
    <template v-for="indexName in ['products_live', 'products_dev']">
      <AlgoliaSearch 
        v-if="indexName.includes(shopEnv)"
        :key="indexName"
        :index-name="indexName"
        :filtering="true"
        :selecting="false"
      />
    </template>
  </div>
</template>
<script>
const _ = require('lodash')
export default {
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