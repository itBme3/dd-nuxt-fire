<template>
  <div class="relative z-999999">
    <ShopifyProductSave
      :show="show"
      from-env="dev"
      to-env="live"
      :dev-product="products.dev"
      :live-product="products.live"
      :dev-metafields="metafields.dev"
      :live-metafields="metafields.live"
      @isOpen="(e) => show = e"
    />
    <gButton @click="show = true">
      open
    </gButton>
  </div>
</template>

<script>
import { FireDb } from '~/utils/firebase';
import {Shopify} from '~/utils/shopify'

export default {
  data(){
    const app = { $fire: this.$fire }
    return {
      show: false,
      db: new FireDb(app),
      shops: {
        live: new Shopify({ app, env: 'live' }),
        dev: new Shopify({ app, env: 'dev' }),
      },
      products: {
        live: { handle: 'tailored-fit-dark-wash', id: 10562886470 },
        dev: { handle: 'tailored-fit-dark-wash', id: 1572676337757 },
      },
      metafields: {
        live: null,
        dev: null,
      }
    }
  },
  mounted() {
    Promise.all(['live', 'dev'].map(this.getCurrent))
      .then(() => {
        this.show = true
      })
      .catch(console.error);
  },
  methods: {
    getCurrent(env) {
      return Promise.all([
        this.shops[env].get({ path: `/products/${this.products[env].id}`, query: { fields: 'title,id,handle,images,body_html,tags' } })
          .then(res => {
            this.products[env] = res.data.body?.product;
            return res
          }).catch(err => {
            console.error(err);
            this.errors.push(`Getting current ${env} product: ${err.message}`)
            return undefined
          }),
        this.db.collection(`products_${env}/${this.products[env].handle}/metafields`)
          .then(docs => {
            this.metafields[env] = {
              product_details: docs.filter(d => d.docId === 'product_details')[0],
              featured_reviews: docs.filter(d => d.docId === 'featured_reviews')[0],
              the_look: docs.filter(d => d.docId === 'the_look')[0],
            }
            console.log({ metafields: this.metafields })
          })
          .catch(err => {
            console.error(err);
            this.errors.push(`Getting current ${env} product: ${err.message}`)
            return { product_details: undefined, featured_reviews: undefined, the_look: undefined }
          })
      ])
    }
  }
}
</script>