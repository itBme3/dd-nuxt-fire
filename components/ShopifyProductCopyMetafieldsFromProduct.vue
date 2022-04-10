<template>
  <div class="shopify-product-copy-metafields-from-product inline">
    <div 
      v-if="metafieldDoc && (!metafieldBlockTitles || !metafieldBlockTitles.length)"
      class="not-found"
      >
      Product does not have a metafield.
    </div>
    <gModal 
      ref="selectBlocks"
      :classes="{
        'overlay': 'bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80',
        'modal': 'max-w-[18rem] p-4 rounded-lg bg-white dark:bg-gray-800 shadow-xl mt-[50vh] transform -translate-y-[70%] mx-auto'
      }"
      :click-to-close="true"
      :disable-body-scroll="false"
      @after-close="selectingImageBlockIndex = null">
      <div v-if="metafieldBlockTitles && metafieldBlockTitles.length"
          class="mx-auto max-w-[260px]">
          <small class="block text-gray-400 dark:text-gray-600 mb-3 uppercase">
            Select Blocks:
          </small>
          <gCheckboxGroup
            v-model="selectedMetafields"
            name="should-save"
            class="mb-6"
            :options="metafieldBlockTitles"
          />
          <Btn class="text-green-900 bg-green-300 hover:bg-green-400"
            @click="$emit('selected', metafieldDoc.value.blocks.filter(block => selectedMetafields.includes(block.title)))">
            Select
          </Btn>
      </div>
    </gModal>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      metafieldKey: {
        type: String,
        default: 'product_details'
      }
    },
    data() {
      return {
        selectedMetafields: [],
        metafieldDoc: null,
        metafieldBlockTitles: null,
      }
    },
    mounted() {
      const onSubmit = this.chooseMetafields.bind(this)
      const onCancel = () => this.$emit([]);
      this.$store.commit('algoliaSelect/open', {
        props: {
          indexName:  `products_live`,
          selecting: {
            multiple: false
          },
        },
        onSubmit,
        onCancel: onCancel.bind(this)
      })
    },
    methods: {
      async chooseMetafields(product) {
        this.metafieldDoc = await this.$db.doc(`products_live/${product.handle}/metafields/${this.metafieldKey}`);
        this.$refs.selectBlocks.show()
        if(this.metafieldKey === 'product_details') {
          this.metafieldBlockTitles = this.metafieldDoc.value?.blocks?.map((block) => 
            block.title
          )
        } else {
          return this.$emit('selected', this.metafieldDoc.value)
        }
      }
    }
  })
</script>

<style scoped>

</style>