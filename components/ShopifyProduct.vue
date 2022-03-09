<template>
  <div class="product mt-1">
    <template 
      v-if="product !== null">
      <code v-if="product.ERROR" class="text-red-500">{{ product.ERROR }}</code>
      <div v-else class="product-info flex flex-col sm:flex-row sm:space-x-2 md:space-x-8 justify-between">
        <div class="product-content w-full sm:w-[calc(66.666%-.25rem)] max-w-3xl flex flex-col space-y-2">

          <label for="product-title">Title:</label>
          <gInput 
            v-model="product.title"
            name="product-title"
            type="text"
            class="w-full text-lg sm:text-2xl md:text-4xl"
          />

          <label for="body-html">Body Html:</label>
          <Editor :content="product.body_html"
            name="body-html"
            class="py-1 w-full"
            @update="(e) => product.body_html = e"
          />

          <label for="product-tags">Tags:</label>
          <RichSelect
            ref="productTags"
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
            @update="(e) => {
              product.tags = e.join(', ')
            }"
          />
        </div>

        <Media 
          v-if="!!product.images && product.images[0]"
          class="w-full mt-5 sm:min-h-full sm:w-[calc(33.333%-.25rem)] max-w-sm max-h-[380px] mx-auto sm:ml-auto sm:mr-0"
          :media="product.images[0]"
          :is-background="true"
          ratio="auto"
        />

      </div>

      <div class="flex flex-col sm:flex-row space-y-2 sm:space-x-2 md:space-x-8 justify-between">

        <ShopifyProductMetafields 
          :env="env" 
          :product-images="product.images"
          class="w-full sm:w-[calc(66.666%-.25rem)] pt-8 max-w-3xl"
          @initial="(e) => {
            metafields[e.docId] = e;
            $emit('initialMetafield', e)
          }"
          @update="(e) => {
            metafields[e.docId] = e;
            $emit('updateMetafield', e)
          }"
        />

        <ShopifyProductImages
          class="w-full sm:w-[calc(33.333%-.25rem)] max-w-sm sm:ml-auto"
          :product-images="product.images"
          @update="(e) => {
            product.images = e;
            $emit('updateProduct', product)
          }"
        />

      </div>

    </template>
    <template v-else>
        <p>Loading...</p>
    </template>
  </div>
</template>

<script>
import {Shopify} from '~/utils/shopify'
import {$algolia} from '~/utils/algolia'

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
    const app = { $fire: this.$fire }
    return {
      shops: {
        live: new Shopify({ app, env: 'live' }),
        dev: new Shopify({ app, env: 'dev' }),
      },
      algoliaIndex: $algolia.initIndex(`products_${ this.env === 'live' ? 'live' : 'dev' }`),
      product: null,
      metafields: {}
    }
  },
  computed: {
    tags() {
      return this.product.tags.split(', ')
    }
  },
  watch: {
    product(value) {
      this.$emit('updateProduct', value)
    }
  },
  created() {
    this.getProduct()
  },
  methods: {
    async getProduct() {
      this.product = await this.shops[this.env].get({ 
        path: '/products', 
        query: { 
          fields: 'id,title,body_html,product_type,handle,status,tags,images',
          handle: this.$route.params.handle,
          limit: 1
        } })
        .then(res => res.data.body.products[0])
        .catch(err => {
          return { ERROR: err.message }
        });
      return this.$emit('initialProduct', this.product)
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
      const top = element.classList.contains('modal-overlay') ? element.childNodes[0].offsetTop - 200 : element.offsetTop + offset;
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