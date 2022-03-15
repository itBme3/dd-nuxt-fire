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
        
        <gButton 
          v-tooltip="'add item'"
          class="add-item-button w-full py-3 mb-2"
          @click="addItem(null, true)"
          >
          <Icon name="add" />
        </gButton>

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
        <gButton
          v-if="
          (viewing === 'product_details' && metafieldObjs.filter(obj => obj.key === viewing)[0].doc && metafieldObjs.filter(obj => obj.key === viewing)[0].doc.value && metafieldObjs.filter(obj => obj.key === viewing)[0].doc.value.blocks.length)
            || (['featuredReviews', 'Complete The Look'].includes(viewing) && metafieldObjs.filter(obj => obj.key === viewing)[0].doc && metafieldObjs.filter(obj => obj.key === viewing)[0].doc.value && metafieldObjs.filter(obj => obj.key === viewing)[0].doc.value.length)
          "
          v-tooltip="'add item'"
          class="add-item-button w-full py-3 mb-2"
          @click="addItem(null)"
          >
          <Icon name="add" />
        </gButton>
      </div>



      <!-- <AlgoliaModalSelect
        v-if="searchAlgolia === 'reviews'"
        :show="true"
        index-name="reviews"
        :multiple="true"
        :filter-values="{ filters: [
          {
            attribute: 'product.handle',
            value: product.handle,
            type: 'refinement_list'
          },
          {
            attribute: 'score',
            value: [4, 5],
            type: 'range'
          }
        ]}"
        :selecting="{
          identifier: `objectID`,
          hideSideNav: true
        }"
        @submit="(e) => {
          addItem(e, prependSelection)
        }"
        @after-close="(e) => {
          searchAlgolia = null
        }"
      />

      <AlgoliaModalSelect
        v-if="searchAlgolia === 'media'"
        :show="true"
        index-name="media"
        :multiple="true"
        :selecting="{
          identifier: `objectID`,
          hideSideNav: true
        }"
        @submit="(e) => {
          addItem(e, prependSelection)
        }"
        @after-close="(e) => {
          searchAlgolia = null
        }"
      />
      
      <AlgoliaQuickSelect 
        v-if="searchAlgolia === 'products_' + env"
        :index-name="'products_' + env"
        :show="true"
        :classes="{
          card: 'p-0',
          hit: 'col-span-full'
        }"
        :card-style="'media-left'"
        :selection-values="lookProductHandles"
        :selecting="{
          quick: true,
          identifier: 'handle',
          multiple: true
        }"
        @submit="(e) => {
          addItem(e, prependSelection);
          scrollTo('metafieldTabs')
        }"
        @after-close="(e) => {
          searchAlgolia = null
        }"
      /> -->


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
      const viewing = metafieldObjs[0].key
    return {
      metafieldObjs,
      viewing,
      fetched: [viewing],
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
  methods: {
    handleize,
    
    // async getMetafieldInFirebase() {
    //   if (this.metafieldObjs.filter(obj => obj.key === this.viewing)[0]?.doc !== null) {
    //     return
    //   }
    //   const metafieldObj = this.metafieldObjs.filter(obj => obj.key === this.viewing)[0];
    //   const docPath = metafieldObj.docPath;
    //   const doc = await this.db.doc(docPath).then(res => {
    //     if(res?.key) {
    //       return res
    //     }
    //     return { 
    //       key: metafieldObj.key, 
    //       namespace: metafieldObj.namespace, 
    //       value: false, 
    //       docId: docPath.split('/').pop(),
    //       docPath
    //     }
    //   });
    //   this.metafieldObjs.filter(obj => obj.key === this.viewing)[0].doc = doc;
    //   return this.$emit('initial', doc);
    // },
    addItem(selection = null, prepend = false) {
      const doc = this.metafieldObjs.filter(obj => obj.key === this.viewing)[0]?.doc || { value: this.viewing === 'Product Details' ? { blocks: [] } : [] };
      const unshiftPush = prepend ? 'unshift' : 'push';
      switch (this.viewing) {
        case 'featuredReviews':
          if(selection === null) {
            this.prependSelection = prepend;
            this.searchAlgolia = 'reviews';
          } else if (Array.isArray(selection)) {
            selection.forEach(itm => doc.value[unshiftPush](itm))
          }
          break;
        case 'product_details':
          if(!doc?.value?.blocks) {
            doc.value = { blocks: [] }
          }
          doc.value.blocks[unshiftPush]({
            title: 'New...',
            content: '',
            image_index: null
          })
          break;
        case 'the_look':
          if(selection === null) {
            this.prependSelection = prepend;
            this.searchAlgolia = `products_${this.env}`;
          } else if (Array.isArray(selection)) {
            const docValue = typeof doc.value === 'string' ? doc.value.split(', ') : !Array.isArray(doc.value) ? [] : doc.value;
            selection.forEach(product => docValue[unshiftPush](product.handle));
            doc.value = docValue.join(', ')
          }
          break;
        default:
          break;
      }
      if (!Array.isArray(selection) && this.viewing !== 'product_details') {
        this.metafieldObjs.filter(d => d.key === this.viewing)[0].doc = doc;
        this.$emit('updateMetafield', doc);
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

<style lang="scss">
.add-item-button {
  + .add-item-button {
    @apply hidden;
  }
}
</style>