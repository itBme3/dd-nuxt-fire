<template>
  <div class="product-metafields">
      <div 
        ref="metafieldTabs"
        class="metafield-tabs flex content-start items-center space-x-2 mb-3">

        <gButton 
          v-for="(obj, objIndex) in metafieldObjs"
          :key="obj.key"
          :class="{
            'font-normal': true,
            'text-red-400 hover:bg-red-400 hover:text-red-900': objIndex === 0,
            'text-purple-400 hover:bg-purple-400 hover:text-purple-900': objIndex === 1,
            'text-blue-400 hover:bg-blue-400 hover:text-blue-900': objIndex === 2,
            'text-green-400 hover:bg-green-400 hover:text-green-900': objIndex === 3,
            'bg-red-400 text-red-900': objIndex === 0 && viewing === obj.key,
            'bg-purple-400 text-purple-900': objIndex === 1 && viewing === obj.key,
            'bg-blue-400 text-blue-900': objIndex === 2 && viewing === obj.key,
            'bg-green-400 text-green-900': objIndex === 3 && viewing === obj.key,
          }"
          @click="viewing = obj.key; scrollTo('metafieldTabs', -100); fetched.includes(obj.key) ? '' : fetched.push(obj.key)">
          {{ obj.label }}
        </gButton>

      </div>

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
import { handleize } from '~/utils/funcs'

export default {
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
          docPath: `products_${this.env}/${this.$route.params.handle}/metafields/product_details`,
          key: 'product_details', namespace: 'studio',
          doc: null
        },
        { 
          label: 'Featured Reviews',
          docPath: `products_${this.env}/${this.$route.params.handle}/metafields/featured_reviews`,
          key: 'featuredReviews', namespace: 'studio',
          doc: null
        },
        { 
          label: 'Complete The Look',
          docPath: `products_${this.env}/${this.$route.params.handle}/metafields/the_look`,
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
    product() {
      try {
        return this.$store?.state?.productPage[this.env]?.product?.images || []
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
}
</script>

<style lang="scss">
.add-item-button {
  + .add-item-button {
    @apply hidden;
  }
}
</style>