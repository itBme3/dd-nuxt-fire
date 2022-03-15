<template>
  <div class="metafield-complete-look">
    <draggable 
      v-if="lookProductHandles && lookProductHandles.length"
      v-model="lookProductHandles"
      class="look-products my-4 space-y-3"
    >
      <template
          v-for="handle in lookProductHandles"
      >
        <CardProduct 
          v-if="$store.state.productsCache[env][handle]"
          :key="handle"
          :card-style="'media-left'"
          class="bg-gray-200 p-0 text-gray-700 max-w-prose mx-auto"
          :classes="{
            media: 'max-w-[9rem]'
          }"
          :item="$store.state.productsCache[env][handle]"
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
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    env: {
      type: String,
      default: null
    }
  },
  data() {
    const namespace = 'studio';
    const key = 'product_details';
    return {
      namespace, key,
      keyPath: `${namespace}.${key}`,
      selectingImageBlockIndex: null,
      lookProducts: {}
    }
  },
  computed: {
    product() {
      try {
          return this.$store?.state.productPage[this.env]?.product
        } catch {
          return null
        }
    },
    metafieldDoc: {
      get() {
        try {
          return this.$store?.state.productPage[this.env]?.metafields[this.keyPath]
        } catch {
          return null
        }
      },
      set(val) {
        const metafield = {key: this.key, namespace: this.namespace, ...(![undefined, null].includes(this.metafieldDoc) ? this.metafieldDoc : {}), ...val}
        this.$store.commit('productPage/setMetafield', { env: this.env, metafield })
      }
    },
    metafieldValue: {
      get() {
        try {
          return this.$store?.state.productPage[this.env]?.metafields[this.keyPath]?.value
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
          return this.metafieldValue?.value?.split(', ') || []
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
    this.$store.dispatch('productPage/getMetafield', { env, namespace, key, handle: this.product.handle })
  },

  methods: {
    scrollTo(refName, offset = 0) {
      const element = this.$refs[refName]?._vnode?.elm || this.$refs[refName];
      const top = element.classList.contains('modal-overlay') ? element.childNodes[0].offsetTop - 200 : element.offsetTop + offset;
      window.scrollTo({top, left: 0, behavior: 'smooth'});
    },
    getLookProducts() {
      if (Array.isArray(this.lookProductHandles) && this.lookProductHandles.length) {
        const fetchHandles = this.lookProductHandles.filter(handle => Object.keys(this.lookProducts).includes(handle))
        if (fetchHandles.length) {
          console.log(fetchHandles);
          Promise.all(fetchHandles.map(handle =>
            this.$store.dispatch('productsCache/getProduct', {handle, env: this.env})
          )).then(products => {
            console.log({products})
            products.forEach(p => { this.lookProducts[p.handle] = p })
          }).catch(err => console.error(err))
        }
      }
    }
  }
}
</script>