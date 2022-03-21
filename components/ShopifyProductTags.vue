<template>
  <div v-if="product && product.tags"
    class="product-tags">

    <LazyRichSelect
      v-if="Array.isArray(tags)"
      ref="productTagSelect"
      name="product-tags"
      :selected="tags"
      :close-on-select="false"
      :multiple="true"
      :variant="'light'"
      :fetch-options="fetchTags"
      :clearable="false"
      :can-create="true"
      :value-attribute="null"
      :text-attribute="null"
      :placeholder="'add tags...'"
      class="mt-1 w-full"
      @update="(e) => updateTags(e)"
    />
    
  </div>
</template>

<script>

export default {
  props: {
    env: {
      type: String,
      default: 'live'
    }
  },
  data() {
    return { 
      search: '',
      adding: false, currentFocus: -1,
      algoliaIndex: this.$algolia.initIndex(`products_${this.env}`),
      productTags: [],
      focused: false
    }
  },
  computed: {
    isProductPage() {
      return !!this.$route?.params?.handle?.length
    },
    tags: {
      get() {
        if(this.product?.tags?.split) {
          return this.product?.tags?.split(', ')
        }
        return null
      },
      set(val) {
        const tags = val?.join(', ') ? val.join(', ') : val
        this.product = { ...([undefined, null].includes(this.product) ? {} : this.product), tags }
      }
    },
    
    product: {
      get() {
        try {
          return this.isProductPage 
            ? this.$store?.state?.productPage[this.env]?.product
            : this.$store?.state?.productCreate?.product
        } catch {
          return null
        }
      },
      set (product) {
        this.isProductPage 
          ? this.$store.dispatch('productPage/setProduct', { env: this.env, product })
          : this.$store.commit('productCreate/setProduct', { value: product })
      }
    }
  },
  watch: {
    adding(val) {
      return setTimeout(() => {
          this.focused = val
      }, 250)
    },
    productTags(val) {
      this.tags = val
    },

  },
  methods: {
    updateTags(e) {
      this.tags = e
    },
    async fetchTags(e) {
      const results = JSON.parse(JSON.stringify(this.tags));
      try {
        await this.algoliaIndex.searchForFacetValues('tags', e)
            .then(res => res.facetHits.forEach(item => !results.includes(item.value) ? results.push(item.value) : ''))
        return  { results }
      } catch(err) {
        return  { results }
      }
    }
  }
}
</script>