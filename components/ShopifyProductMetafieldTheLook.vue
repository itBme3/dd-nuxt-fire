<template>
  <div class="metafield-complete-look">

    <gButton 
      class="add-item-button w-full py-3 mb-2 border-2 border-gray-500 border-opacity-20 hover:border-opacity-100 hover:border-yellow-200 text-yellow-200 hover:bg-yellow-200 hover:text-yellow-900"
      @click="addItems()"
      >
      <Icon name="add" />
    </gButton>

    <draggable 
      v-if="lookProductHandles && lookProductHandles.length"
      v-model="lookProductHandles"
      class="look-products my-4 space-y-3"
    >
      <template
          v-for="handle in lookProductHandles"
      >
        <CardProduct 
          v-if="$store.state.productsCache[isProductPage ? env : 'live'][handle]"
          :key="handle"
          :card-style="'media-left'"
          class="bg-gray-200 p-0 text-gray-700 max-w-prose mx-auto"
          :classes="{
            media: 'max-w-[9rem]'
          }"
          :item="$store.state.productsCache[isProductPage ? env : 'live'][handle]"
        >
        <template #after>
          <ButtonDelete
            class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            @delete="() => {
              const value = obj.doc.value.split(', ').splice(reviewIndex, 1);
              obj.doc.value = value.join(', ')
              $emit('update', obj.doc);
            }"
          />
        </template>
        </CardProduct>
      </template>
    </draggable>

    <gButton 
      v-if="metafieldValue && metafieldValue.length"
      class="add-item-button w-full py-3 mb-2 border-2 border-gray-500 border-opacity-20 hover:border-opacity-100 hover:border-yellow-200 text-yellow-200 hover:bg-yellow-200 hover:text-yellow-900"
      @click="addItems(true)"
      >
      <Icon name="add" />
    </gButton>
    
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'

export default Vue.extend({
  components: {
    draggable
  },
  props: {
    env: {
      type: String,
      default: 'live'
    }
  },
  data() {
    const namespace = 'studio';
    const key = 'the_look';
    return {
      namespace, key,
      keyPath: `${namespace}.${key}`,
      selectingImageBlockIndex: null,
      lookProducts: {}
    }
  },
  computed: {
    isProductPage() {
      return !!this.$route?.params?.handle?.length
    },
    product() {
      try {
        return this.isProductPage 
          ? this.$store?.state.productPage[this.env]?.product
          : this.$store?.state.productCreate?.product
        } catch {
          return null
        }
    },
    metafieldDoc: {
      get() {
        try {
          return this.isProductPage 
            ? this.$store?.state.productPage[this.env]?.metafields[this.keyPath]
            : this.$store?.state.productCreate?.metafields[this.keyPath]
        } catch {
          return null
        }
      },
      set(val) {
        const metafield = {key: this.key, namespace: this.namespace, ...(![undefined, null].includes(this.metafieldDoc) ? this.metafieldDoc : {}), ...val}
        this.isProductPage 
          ? this.$store.dispatch('productPage/setMetafield', { env: this.env, metafield })
          : this.$store.commit('productCreate/setMetafield', { metafield })
      }
    },
    metafieldValue: {
      get() {
        try {
          return this.metafieldDoc?.value
        } catch {
          return null
        }
      },
      set(value) {
        const metafieldDoc = {key: this.key, namespace: this.namespace, ...(![undefined, null].includes(this.metafieldDoc) ? this.metafieldDoc : {}), value}
        this.metafieldDoc = metafieldDoc
      }
    },
    lookProductHandles: {
      get() {
        try {
          return this.metafieldValue?.split(', ') || []
        } catch(err) {
          return []
        }
      },
      set(val) {
        const value = val.join(', ')
        this.metafieldValue = value;
      }
    }
  },

  watch: {
    lookProductHandles() {
      this.getLookProducts()
    }
  },

  mounted()  {
    const { env, namespace, key } = this
    if(this.isProductPage) {
      this.$store.dispatch('productPage/getMetafield', { env, namespace, key, handle: this.product.handle })
    }
  },

  methods: {
    scrollTo(refName, offset = 0) {
      const element = this.$refs[refName]?._vnode?.elm || this.$refs[refName];
      const top = element.classList.contains('modal-overlay') 
        ? element.childNodes[0].offsetTop - 200 
        : element.offsetTop + offset;
      window.scrollTo({top, left: 0, behavior: 'smooth'});
    },
    addItems(append = false) {
      const onSubmit = (selection) => {
          if (Array.isArray(selection)) {
            const selectionHandles = selection
              .map(p => p.handle)
              .filter(h => !this.lookProductHandles.includes(h))
            this.metafieldValue = (append 
              ? [...this.lookProductHandles, ...selectionHandles] 
              : [...selectionHandles, ...this.lookProductHandles]
              ).join(', ')
            setTimeout(() => {
              window.scrollTo({top: this.$el.offsetTop + (append ? this.$el.offsetHeight : 0), left: 0, behavior: 'smooth'});
            }, 250)
          }
      }
      this.$store.commit('algoliaSelect/open', { 
        props: { 
          indexName: this.isProductPage 
            ? `products_${this.env}`
            : `products_live`,
          selected: this.lookProductHandles,
          selecting: {
            identifier: 'handle',
            // quick: true,
            multiple: true
          }
        },
        onSubmit
      })
    },
    getLookProducts() {
      if (Array.isArray(this.lookProductHandles) && this.lookProductHandles.length) {
        const fetchHandles = this.lookProductHandles.filter(handle => Object.keys(this.lookProducts).includes(handle))
        if (fetchHandles.length) {
          Promise.all(fetchHandles.map(handle =>
            this.$store.dispatch('productsCache/getProduct', {handle, env: this.env})
          )).then(products => {
            products.forEach(p => { this.lookProducts[p.handle] = p })
          }).catch(err => console.error(err))
        }
      }
    }
  }
})
</script>