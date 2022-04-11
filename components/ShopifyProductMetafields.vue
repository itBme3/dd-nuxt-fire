<template>
  <div class="product-metafields">
       <scrollbar 
        ref="metafieldTabs"
        class="metafield-tabs flex content-start items-center space-x-2 my-auto overflow-x-scroll ml-0 mb-3">

        <gButton 
          v-for="(obj, objIndex) in metafieldObjs"
          :key="obj.key"
          :class="{
            'font-normal text-sm md:text-base': true,
            'text-red-400 hover:bg-red-400 hover:text-red-900': objIndex === 0,
            'bg-red-400 text-red-900': objIndex === 0 && viewing === obj.key,
            'text-purple-400 hover:bg-purple-400 hover:text-purple-900': objIndex === 4,
            'bg-purple-400 text-purple-900': objIndex === 4 && viewing === obj.key,
            'text-orange-300 hover:bg-orange-300 hover:text-orange-900': objIndex === 6,
            'bg-orange-300 text-orange-900': objIndex === 6 && viewing === obj.key,
            'text-blue-300 hover:bg-blue-300 hover:text-blue-900': objIndex === 3,
            'bg-blue-300 text-blue-900': objIndex === 3 && viewing === obj.key,
            'text-cyan-300 hover:bg-cyan-300 hover:text-cyan-900': objIndex === 1,
            'bg-cyan-300 text-cyan-900': objIndex === 1 && viewing === obj.key,
            'bg-yellow-200 text-yellow-900': objIndex === 2 && viewing === obj.key,
            'text-yellow-200 hover:bg-yellow-200 hover:text-yellow-900': objIndex === 2,
            'bg-green-200 text-green-900': objIndex === 5 && viewing === obj.key,
            'text-green-300 hover:bg-green-300 hover:text-green-900': objIndex === 5,
          }"
          @click="viewing = obj.key; scrollTo('metafieldTabs', -100); fetched.includes(obj.key) ? '' : fetched.push(obj.key)">
          {{ obj.label }}
        </gButton>

       </scrollbar>

      <div
        ref="metafieldPanels"
        class="metafield-panels"
      >
        

        <div 
          v-for="obj in metafieldObjs"
          :key="obj.key + '-panel'"
          :class="{
            'panel max-w-full overflow-x-scroll': true,
            [handleize(obj.label)]: true
          }"
        >
        <template v-if="obj.key === 'product_details'">
          <ShopifyProductMetafieldProductDetails 
            v-if="fetched.includes(obj.key)"
            :class="{
              'hidden': viewing !== obj.key
            }"
            :env="env"
          />
        </template>

        <template v-if="obj.key === 'featuredReviews'">
          <ShopifyProductMetafieldFeaturedReviews
            v-if="fetched.includes(obj.key)"
            :class="{
              'hidden': viewing !== obj.key
            }"
            :env="env"
          />
        </template>

        <template v-if="obj.key === 'the_look'">
          <ShopifyProductMetafieldTheLook
            v-if="fetched.includes(obj.key)"
            :class="{
              'hidden': viewing !== obj.key
            }"
            :env="env"
          />
        </template>

        </div>
        
      </div>

  </div>
</template>

<script>
import Vue from 'vue'
import { handleize } from '~/utils/funcs'

export default Vue.extend({
  props: {
    env: {
      type: String,
      default: null
    }
  },
  data() {
    const metafieldObjs = [
        { 
          label: 'Product Details',
          docPath: this.isProductPage ? `products_${this.env}/${this.$route.params.handle}/metafields/product_details` : null,
          key: 'product_details', namespace: 'studio',
          doc: null
        },
        { 
          label: 'Featured Reviews',
          docPath: this.isProductPage ? `products_${this.env}/${this.$route.params.handle}/metafields/featured_reviews` : null,
          key: 'featuredReviews', namespace: 'studio',
          doc: null
        },
        { 
          label: 'Complete The Look',
          docPath: this.isProductPage ? `products_${this.env}/${this.$route.params.handle}/metafields/the_look` : null,
          key: 'the_look', namespace: 'studio',
          doc: null
        },
      ]
    return {
      metafieldObjs,
      viewing: metafieldObjs[0].key,
      fetched: [],
      searchAlgolia: null, /* either null or index name — media, reviews, products_{env} */
      prependSelection: false,
      selectingImageBlockIndex: null
    }
  },
  computed: {
    isProductPage() {
      return !!this.$route?.params?.handle?.length
    },
    product() {
      try {
        return this.isProductPage 
          ? this.$store?.state?.productPage[this.env]?.product
          : this.$store?.state?.productCreate?.product
      } catch {
        return null
      }
    }
  },
  mounted() {
    this.fetched = []
    setTimeout(() => {
      this.fetched = [this.viewing]
    }, 200)
    
  },
  methods: {
    handleize,
    
    scrollTo(refName, offset = 0) {
      const element = this.$refs[refName]?._vnode?.elm || this.$refs[refName];
      const top = element.classList.contains('modal-overlay') ? element.childNodes[0].offsetTop - 200 : element.offsetTop + offset;
      window.scrollTo({top, left: 0, behavior: 'smooth'});
    }
  }
})
</script>

<style lang="scss">
.add-item-button {
  + .add-item-button {
    @apply hidden;
  }
}
</style>