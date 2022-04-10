<template>
  <div v-if="product">
    {{ imagesCompleted }}
    {{ newImages }}
    <gButton @click="saveProduct()">save images</gButton>
  </div>
</template>

<script>
  import Vue from 'vue'
import { ShopEnv } from '~/models/shopify.models'
  // import {ensureShopifyProductImages} from '~/utils/products'

  export default Vue.extend({
    data() {
      return {
        imagesCompleted: 0,
        productId: 6767555313757,
        product: null,
        images: [
          {
            src: `https://firebasestorage.googleapis.com/v0/b/dearborn-fire/o/media%2F1648145474044_6-Relaxed-fit-dark-wash-6-pocket-12.jpg?alt=media&token=6b633be9-b244-4e35-84f7-316e60f3acfb`,
            alt: 'first'
          },
          {
            src: `https://firebasestorage.googleapis.com/v0/b/dearborn-fire/o/media%2F1648145474038_6-Relaxed-fit-dark-wash-6-pocket-03.jpg?alt=media&token=4d15a007-d83c-41c8-bca5-2547e2a89c64`,
            alt: 'second'
          },
          {
            src: `https://firebasestorage.googleapis.com/v0/b/dearborn-fire/o/media%2F1648145474042_6-Relaxed-fit-dark-wash-6-pocket-09.jpg?alt=media&token=12121878-1143-4838-9e84-db5a59304260`,
            alt: 'third'
          }
        ],
        newImages: []
      }
    },
    mounted() {
      this.getProduct().catch(console.error)
    },
    methods: {
      async getProduct() {
        this.product = await this.$shops[ShopEnv.DEV].get({path: `products/${this.productId}`})
          .then((res) => {
            console.log(res.data.body);
            return res.data
          })
          return this.product
      },
      saveProduct() {
        let imageName = this.images[0].src.split('media%2F')[1].split('?')
        imageName.pop('?');
        imageName = imageName.join('?')
        console.log(imageName)
        return this.$fire.functions.httpsCallable('tempImage')(imageName).then(console.log)


        // this.newImages = await ensureShopifyProductImages({
        //   ...this.product,
        //   images: this.images
        // }, this.$shops[ShopEnv.DEV], this.productImagesPercentCompleted.bind(this))

      },
      productImagesPercentCompleted(perc) {
        this.imagesCompleted = perc
      }
    }
  })
</script>

<style scoped>

</style>