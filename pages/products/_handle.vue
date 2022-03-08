<template>
  <div class="product-page max-w-6xl mx-auto">
    <div class="product-toolbar flex items-center sticky top-[40px] w-full bg-gray-100 dark:bg-gray-900 z-9999">
      <ShopifyToggleEnv 
        :env="shopEnv"
        class="ml-auto mr-3"
        @change="toggleEnv"
      />
      <gDropdown 
        v-if="changesDetected[shopEnv]"
        class="w-auto mr-0"
        :classes="{ dropdown: 'left-auto w-40 right-0 w-full' }">
        <div
          slot="trigger"
          slot-scope="{ mousedownHandler, focusHandler, blurHandler, keydownHandler }"
          class="dropdown-trigger">
          <gButton
            id="text-tag"
            class="text-blue-500 ml-auto"
            aria-label="Select text tag menu"
            aria-haspopup="true"
            @mousedown="mousedownHandler"
            @focus="focusHandler"
            @blur="blurHandler"
            @keydown="keydownHandler"
          >
            <span>save</span> <Icon class="my-auto ml-2 mr-0" :name="'save'" />
          </gButton>
        </div>
        <div 
          slot-scope="{ hide }"
          class="dropdown-buttons"
          >
          <gButton role="menuitem" @click="(e) => { 
              hide(e); savingTo = 'live'
            }">
            LIVE
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); savingTo = 'dev'
            }">
            DEV
          </gButton>
        </div>
      </gDropdown>
    </div>

    <template v-for="env in ['dev', 'live']">
      <ShopifyProduct
        v-if="fetched[env] || env === shopEnv"
        :key="env"
        :handle="$route.params.handle"
        :env="env"
        :class="{
          'hidden': shopEnv !== env
        }"
        @initialProduct="(e) => initial.products[env] = JSON.parse(JSON.stringify(e))"
        @initialMetafield="(e) => initial.metafields[env][e.docId] = JSON.parse(JSON.stringify(e))"
        @updateProduct="(e) => products[env] = e"
        @updateMetafield="(e) => metafields[env][e.docId] = e"
      />
    </template>

    <client-only>
      <ShopifyProductSave
        v-if="savingTo !== null"
        :show="savingTo !== null"
        :from-env="shopEnv"
        :to-env="savingTo"
        :dev-product="products.dev"
        :live-product="products.live"
        :dev-metafields="metafields.dev"
        :live-metafields="metafields.live"
        @isOpen="(e) => !e ? savingTo = null : ''"
      />
    </client-only>

  </div>
</template>

<script>
import qs from 'qs'
import { objectsAreTheSame } from '~/utils/funcs';

export default {
  beforeRouteLeave (to, from, next) {
    console.log({ values: Object.values(this.changesDetected), length: Object.values(this.changesDetected).filter(v => v).length  })
    if (Object.values(this.changesDetected).filter(v => v).length === 0) {
      return next();
    }
    const answer = window.confirm('Unsaved changes will be lost')
    if (answer) {
      next()
    } else {
      next(false)
    }
  },
  data() {
    const shopEnv = (this.$route?.hash?.length ? this.$route.hash : 'live').replace('#', '').trim().toLowerCase() === 'dev' ? 'dev' : 'live';
    const products = { live: null, dev: null };
    const metafields = {
      live: { product_details: null, featured_reviews: null, the_look: null},
      dev: { product_details: null, featured_reviews: null, the_look: null}
    };
    return { 
      shopEnv,
      fetched: { dev: shopEnv === 'dev', live: shopEnv === 'live' },
      savingTo: null,
      products,
      metafields,
      initial: JSON.parse(JSON.stringify({products, metafields})),
    }
  },
  computed: {
    changesDetected () {
      return {
        live: this.detectChanges('live'),
        dev: this.detectChanges('dev')
      }
    }
  },
  watch: {
    'shopEnv': _.debounce(function(val) {
      if(this.$route.hash.replace('#', '') === this.shopEnv) return;
      this.toggleEnv(val)
    }, 250)
  },
  methods: {
    toggleEnv(env) {
      const shopEnv = env.replace('#', '').trim().toLowerCase() === 'dev' ? 'dev' : 'live';
      if(this.shopEnv === shopEnv) { return }
      this.fetched[env] = true;
      this.shopEnv = shopEnv;
      const queryString = qs.stringify(this.$route.query);
      const path = `${this.$route.path.split('#')[0]}#${shopEnv}${ queryString?.length ? `?${queryString}` : '' }`;
      window.history.pushState({path}, '', path);
    },
    detectChanges(env) {
      const initialProduct = this.initial.products[env];
      const product = this.products[env];
      const initialMetafields = { product_details: null, featured_reviews: null, the_look: null , ...this.initial.metafields[env]};
      const metafields = { product_details: null, featured_reviews: null, the_look: null , ...this.metafields[env]};
      if ( product === null 
          && Object.values(metafields).filter((metafield) => metafield?.value).length === 0 ) {
        return false
      }
      const productImagesSame = product.images.filter(img => {
        if(!img?.id) { return false }
        const initialImg = initialProduct.images.filter(i => i.id === img.id)[0];
        if (!initialImg) { return false }
        return ['src', 'alt', 'position'].filter(k => {
          return initialImg[k] === img[k]
        }).length === 3
      }).length === product.images.length;
      if(!productImagesSame) { return true }
      const productsSame = objectsAreTheSame(initialProduct, product);
      const metafieldsSame = objectsAreTheSame(initialMetafields, metafields);
      if ((productsSame || !product) && (metafieldsSame || Object.values(metafields).filter((metafield) => metafield?.value).length === 0)) { 
        return false
      }
      return true
    }
  }
}
</script>