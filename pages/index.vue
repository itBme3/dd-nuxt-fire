<template>
  <div class="max-w-full">


    <gButton
      v-for="algoliaIndexName in ['media', 'reviews', 'products_live', 'products_dev']"
      :key="algoliaIndexName"
      @click="$store.commit('algoliaSelect/open', { props: {indexName: algoliaIndexName}, onSubmit: onSubmit, onUpdate: onUpdate, onCancel: onCancel })">
      {{ algoliaIndexName }}
    </gButton>
    
    <pre><code>{{ selectedValues }}</code></pre>

    <!-- <ShopifyToggleEnv
      :env="env"
      @change="(e) => {
        env = e
        $store.dispatch('productPage/getProduct', {handle: productHandle, env: env })
          .catch(console.error)
      }" />

    <div class="flex flex-wrap space-x-1 space-y-1">
      <gButton 
        v-for="handle in handles"
        :key="handle"
        class="w-auto"
        @click="productHandle = handle">
        {{ handle }}
      </gButton>
    </div>

    <div class="flex flex-wrap space-x-1 space-y-1">
      <gButton 
        v-for="key in metafieldKeys"
        :key="key"
        class="w-auto"
        @click="metafieldKey = key">
        {{ key }}
      </gButton>
    </div>

    <pre v-if="!!$store.state && !!$store.state.productPage"><code>
      {{ JSON.stringify($store.state.productPage, null, 4) }}
    </code></pre> -->



    <!-- <div> -->
      <!-- <gInput
        v-model="handle"
      />
      <gButton class="bg-cyan-400 text-cyan-900" @click="setCacheProduct">GET</gButton>
      <gButton class="bg-yellow-400 text-yellow-900" @click="reload">RELOAD</gButton>
        <pre v-if="!fetching"><code>{{ JSON.stringify($store.state.productsCache, null, 4) }}</code></pre> -->
      
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

      <AlgoliaModalSelect 
        :index-name="'products_live'"
        :selected="selected"
        @change="(e) => selected = e"
        @submit="submitSelection"
      /> -->
      <!-- <Codeblock>{{ JSON.stringify(products, null, 2) }}</Codeblock> -->
      <!-- <SelectStarRating
        :value="rating"
        @change="updateRating"/> -->
    <!-- </div> -->
  </div>
</template>

<script lang="js">




export default {

  async asyncData({ $store }) {
    try {
      await $store.dispatch('productPage/getProduct', { handle: 'tailored-fit-dark-wash', env: 'dev' });
      return {}
    } catch(err) {
      return {}
    }
  },

  data() {
      const handles = ['tailored-fit-dark-wash', 'tailored-fit=light-wash', 'tailored-fit-dark-wash-v2', 'tailored-fit-dark-wash-v3', 'tailored-fit-grey-wash']
      const metafieldKeys = ['product_details', 'featuredReviews', 'the_look']
    return {
      handles, metafieldKeys,
      productHandle: handles[0],
      metafieldKey: metafieldKeys[0],
      env: 'dev',
      productPageData: this.$store.state.productPage,
      selectedValues: {
        media: [], reviews: [], products_live: [], products_dev: []
      }
    }
  },

  computed: {
    indexName() {
      return this.$store.state?.algoliaSelect?.props?.indexName
    }
  },
  watch: {
    productHandle(handle) {
      this.$store.dispatch('productPage/getProduct', {handle, env: this.env})
        .then(console.log)
    },
    metafieldKey(key) {
      this.$store.dispatch('productPage/getMetafield', {handle: this.productHandle, namespace: 'studio', key, env: this.env})
        .then(console.log)
    },
    '$store.state.productPage'(val) {
      this.productPageData  = data
      console.log({ val })
    }
  },

  mounted() {
    this.$store.dispatch('productPage/getProduct', { handle: 'tailored-fit-dark-wash', env: 'dev' })
      .then(res => console.log(res));
  },
  methods: {

    onUpdate(e) {
      console.log('UPDATE')
      this.selectedValues[this.indexName] = e
      console.log({ selection: e, this: this })
    },
    onSubmit(e) {
      console.log('SUBMIT')
      this.selectedValues[this.indexName] = e
      console.log({ selection: e, this: this })
    },
    onCancel(e) {
      console.log('CANCEL')
      this.selectedValues[this.indexName] = e
      console.log({ selection: e, this: this })
    }

  //   updateRating(e) {
  //     this.rating = e
  //     console.log({ rating: this.rating })
  //   },
  //   submitSelection(e) {
  //     console.log('SUbMIT: ', e)
  //   },
  //   fetchOptions(e) {
  //     return this.index.searchForFacetValues('tags', e)
  //       .then(res => res.facetHits)
  //       .then(results => { return {results} });
  //   },
  //   setCacheProduct() {
  //     this.$store.dispatch('productsCache/getProduct', {handle: this.handle, env: 'dev'})
  //       .then(console.log)
  //       .catch(console.error)
  //     // this.$store.commit('productsCache/set', {product: {title: 'test-3', id: 123, handle: 'test-3', images: null}, env: 'dev'})

  //     // const product = await this.db.doc(`products_dev/${this.handle}`).then(res => {
  //     //   if(!res?.handle) { return null }
  //     //   const { title, id, handle, images } = res;
  //     //   return { title, id, handle, image: images[0] }
  //     // })
  //     // if(product !== null) {
  //     //   this.$store.state.localStorage.productsCache.dev[this.handle] = product
  //     // }
  //     // .commit('localStorage/setCacheProduct', {app: { $fire: this.$fire }, handle: this.handle, env: 'dev'})
  //     // this.reload()
  //   },
  //   reload() {
  //     this.fetching = true; 
  //     setTimeout(() => { this.fetching = false }, 500)
  //   }
  //   // getCachedProduct() {
  //   //   this.$store.local
  //   // }
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
