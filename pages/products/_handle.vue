<template>
  <div class="product-page max-w-7xl mx-auto">
    <div class="product-toolbar flex items-center sticky top-[60px] w-full bg-gray-100 dark:bg-gray-900 z-9999">
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
              hide(e); saveTo(['live'])
            }">
            LIVE
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); saveTo(['dev'])
            }">
            DEV
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); saveTo(['live', 'dev'])
            }">
            LIVE & DEV
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
      />
    </template>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  beforeRouteLeave (to, from, next) {
    
    if (Object.values(this.changesDetected).filter(v => v).length === 0) {
      this.$store.commit('productPage/resetState')
      this.products = { live: null, dev: null }
      return next();
    }
    const answer = window.confirm('Unsaved changes will be lost')
    if (answer) {
      this.$store.commit('productPage/resetState')
      this.products = { live: null, dev: null }
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
        live: this.$store.state.productPage.live.changes?.product?.length || this.$store.state.productPage.live.changes?.metafields?.length,
        dev: this.$store.state.productPage.dev.changes?.product?.length || this.$store.state.productPage.dev.changes?.metafields?.length,
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
    saveTo(to) {
      this.$store.commit('productPage/saving', { from: this.shopEnv, to })
    },
    toggleEnv(env) {
      const shopEnv = env.replace('#', '').trim().toLowerCase() === 'dev' ? 'dev' : 'live';
      if(this.shopEnv === shopEnv) { return }
      this.fetched[env] = true;
      this.shopEnv = shopEnv;
      const queryString = qs.stringify(this.$route.query);
      const path = `${this.$route.path.split('#')[0]}#${shopEnv}${ queryString?.length ? `?${queryString}` : '' }`;
      window.history.pushState({path}, '', path);
    }
  }
}
</script>