<template>
  <div class="max-w-full">
    <div>
      <gInput
        v-model="handle"
      />
      <gButton class="bg-cyan-400 text-cyan-900" @click="setCacheProduct">GET</gButton>
      <gButton class="bg-yellow-400 text-yellow-900" @click="reload">RELOAD</gButton>
        <pre v-if="!fetching"><code>{{ JSON.stringify($store.state.productsCache, null, 4) }}</code></pre>
      
      <!-- <code v-if="!fetching">{{ JSON.stringify(productsCache) }}</code> -->
      <!-- <Codeblock v-if="!!docs">{{ JSON.stringify(docs, null, 2) }}</Codeblock>
      <Codeblock v-if="!!products">{{ JSON.stringify(products, null, 2) }}</Codeblock>

    <Editor :content="content"
      @update="(e) => content = e" />
    <Codeblock>{{ content }}</Codeblock>
    <RichSelect
      :close-on-select="false"
      :multiple="true"
      :variant="'cyan'"
      :options="options"
      :can-create="true"
      :selected="selected"
      :value-attribute="null"
      :text-attribute="null"
      @update="(e) => selected = e"
    />

      <ModalSelectAlgolia 
        :index-name="'products_live'"
        :selected="selected"
        @change="(e) => selected = e"
        @submit="submitSelection"
      /> -->
      <!-- <Codeblock>{{ JSON.stringify(products, null, 2) }}</Codeblock> -->
      <!-- <SelectStarRating
        :value="rating"
        @change="updateRating"/> -->
    </div>
  </div>
</template>

<script lang="js">
import {Shopify} from '~/utils/shopify'
import {$algolia} from '~/utils/algolia'
import { FireDb } from '~/utils/firebase'

export default {
  async asyncData({ app }) {
    const db = new FireDb(app);
    // const docs = await db.doc('products_live/tailored-fit-dark-wash')
    
    const docs = null;
    const shops = {
      live: new Shopify({ app, env: 'live' }),
      dev: new Shopify({ app, env: 'dev' }),
    }
    const products = await shops.dev.get({ path: '/products', query: { fields: 'id,title' } })
      .then(res => res.data)
    return {
      db, docs, products
    }
    
  },

  data() {
    return {
      content: '',
      rating: 3,
      selected: [],
      index: $algolia.initIndex('media'),
      options: [
        {title: 'something', id: 1},
        {title: 'another thing', id: 2},
        {title: 'this thing', id: 3},
        {title: 'on last thing', id: 4},
      ].map(o => o.title),
      handle: 'tailored-fit-dark-wash',
      fetching: false
    }
  },
  computed: {
    loaded() {
      return this.$store.state.productsCache.status
    },
  },

  mounted() {
    this.$store.state.productsCache.status = true
  },
  methods: {
    updateRating(e) {
      this.rating = e
      console.log({ rating: this.rating })
    },
    submitSelection(e) {
      console.log('SUbMIT: ', e)
    },
    fetchOptions(e) {
      return this.index.searchForFacetValues('tags', e)
        .then(res => res.facetHits)
        .then(results => { return {results} });
    },
    setCacheProduct() {
      this.$store.dispatch('productsCache/getProduct', {handle: this.handle, env: 'dev'})
        .then(console.log)
        .catch(console.error)
      // this.$store.commit('productsCache/set', {product: {title: 'test-3', id: 123, handle: 'test-3', images: null}, env: 'dev'})

      // const product = await this.db.doc(`products_dev/${this.handle}`).then(res => {
      //   if(!res?.handle) { return null }
      //   const { title, id, handle, images } = res;
      //   return { title, id, handle, image: images[0] }
      // })
      // if(product !== null) {
      //   this.$store.state.localStorage.productsCache.dev[this.handle] = product
      // }
      // .commit('localStorage/setCacheProduct', {app: { $fire: this.$fire }, handle: this.handle, env: 'dev'})
      // this.reload()
    },
    reload() {
      this.fetching = true; 
      setTimeout(() => { this.fetching = false }, 500)
    }
    // getCachedProduct() {
    //   this.$store.local
    // }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
