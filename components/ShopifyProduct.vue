<template>
  <div class="product mt-1 sm:px-2 md:px-4 lg:px-6">
    <template 
      v-if="product !== null && Object.keys(product).length">
      <code v-if="product.ERROR" class="text-red-400 rounded p-6 shadow-lg">{{ product.ERROR }}</code>
      <div v-else class="product-info flex flex-col sm:flex-row sm:space-x-2 md:space-x-8 justify-between">
        <div class="product-content w-full sm:w-[calc(66.666%-.25rem)] max-w-3xl flex flex-col space-y-2">

          <label for="product-title">Title:</label>
          <gInput 
            :value="product.title"
            name="product-title"
            type="text"
            class="w-full text-lg sm:text-2xl"
            @input="(e) => product = {...product, title:e}"
          />

          <div class="flex items-center content-start">
            <gToggle 
              value="active"
              unchecked-value="draft"
              :checked="product.status === 'active'"
              class="w-auto mr-2"
              name="product-status"
              @input="(e) => product = {...product, status: e }"
            />
            <label for="product-status" class="capitalize mr-auto">Status: <span :class="{'text-blue-500': product.status === 'active'}">{{ product.status }}</span></label>
          </div>

          <label for="body-html">Body Html:</label>
          <Editor :content="product.body_html"
            name="body-html"
            class="py-1 w-full"
            @update="(e) => product = {...product, body_html:e}"
          />

          <label for="product-tags">Tags:</label>
          <ShopifyProductTags :env="env" />
          
        </div>

        <Media 
          class="w-full mt-5 sm:min-h-full sm:w-[calc(33.333%-.25rem)] max-w-sm max-h-[380px] mx-auto sm:ml-auto sm:mr-0"
          :media="product.images[0]"
          :is-background="true"
          :editable="!product.images || !product.images.length"
          ratio="auto"
        />

      </div>

      <div class="flex flex-col sm:flex-row space-y-2 sm:space-x-2 md:space-x-8 justify-between">

        <ShopifyProductMetafields 
          :env="env" 
          class="w-full sm:w-[calc(66.666%-.25rem)] pt-8 max-w-3xl"
        />

        <ShopifyProductImages
          :env="env"
          class="w-full sm:w-[calc(33.333%-.25rem)] max-w-sm sm:ml-auto"
        />

      </div>

    </template>
    <template v-else-if="product === null">
        <Loading />
    </template>
    <template v-else>
      <p class="text-center">Product not found in "{{ env }}" shop</p>
    </template>
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
  },
  data() {
    return {
      algoliaIndex: this.$algolia.initIndex(`products_${ this.env === 'live' ? 'live' : 'dev' }`),
      metafields: {},
      showTags: []
    }
  },
  computed: {
    tags: {
      get() {
        return this.product.tags.split(', ')
      },
      set(val) {
        // const product = this.product === null ? { handle: this.$route.params.handle } : this.product
        const tags = val?.join(', ') ? val.join(', ') : val
        this.product = { ...([undefined, null].includes(this.product) ? {} : this.product), tags }
      }
    },
    product: {
      get() {
        try {
          return this.$store?.state?.productPage[this.env]?.product
        } catch {
          return false
        }
      },
      set (product) {
        this.$store.dispatch('productPage/setProduct', { env: this.env, product })
      }
    }
  },
  watch: {
    env(val) {
      if(this.showTags.includes(val)) { return };
      setTimeout(() => {
        this.showTags.push(val)
      }, 2000)
    }
  },
  mounted() {
    this.getProduct();
    setTimeout(() => {
        this.showTags.push(this.env)
      }, 2000)
  },
  methods: {
    getProduct() {
      this.$store.dispatch('productPage/getProduct', { env: this.env, handle: this.$route.params.handle })
        .catch(console.error)
    },
    async fetchTags(e) {
      const results = [];
      try {
        await Promise.all(['tags','fit','category','apparel','fit','material','color','wash','chart'].map(key => {
          return this.algoliaIndex.searchForFacetValues(key, e)
            .then(res => res.facetHits)
            .then(items => { 
              items.map(item => key === 'tags' ? item.value : `${key}:${item.value}`)
                .forEach(item => results.push(item))
            });
        })
        )
        return  { results }
      } catch(err) {
        console.error(err);
        return  { results }
      }
    },
    scrollTo(refName, offset = 0) {
      const element = this.$refs[refName]?._vnode?.elm || this.$refs[refName];
      const top = element.offsetTop + offset;
      window.scrollTo({top, left: 0, behavior: 'smooth'});
    }
  }
}
</script>


<style lang="scss" scoped>
label {
  @apply text-xs text-gray-500 dark:text-gray-500
}
</style>