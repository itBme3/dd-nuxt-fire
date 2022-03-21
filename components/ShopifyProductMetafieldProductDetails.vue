<template>
<div class="metafield-product-details">
  
  <gButton 
    class="add-item-button w-full py-3 mb-2 border-2 border-gray-500 border-opacity-20 hover:border-opacity-100 hover:border-red-400 text-red-400 hover:bg-red-400 hover:text-red-900"
    @click="addItems()"
    >
    <Icon name="add" />
  </gButton>

  <draggable 
    v-if="!!metafieldBlocks"
    v-model="metafieldBlocks"
  >
    <Card
      v-for="(block, blockIndex) in metafieldBlocks"
      :key="key + '-' + block.title"
      :ref="key + blockIndex"
      class="w-full mb-2 hover:scale-100 relative group overflow-visible"
      :classes="{ media: 'flex items-stretch content-center' }"
      card-style="media-left">
      <template #before>
        <ButtonDelete
          class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
          @delete="() => {
            const blocks = JSON.parse(JSON.stringify(metafieldBlocks));
            blocks.splice(blockIndex, 1);
            metafieldBlocks = blocks;
          }"
        />
      </template>
        <template #media>
          <Media 
            v-if="block && block.image_index > -1"
            class="product-image w-full h-full cursor-move rounded shadow-md max-w-sm max-h-[380px] mx-auto sm:ml-auto sm:mr-0"
            :media="images[block.image_index]"
            :is-background="true"
            ratio="1:1"
          />
          <Icon v-else name="image" class="m-auto" />
          <gButton class="rounded-none bg-transparent p-0 flex items-start content-center w-full m-0 h-full absolute inset-0 z-1 text-opacity-0"
            @click="(e) => {
              selectImageIndex(e, blockIndex)
            }">
            select image
          </gButton>
        </template>
      <gInput 
        :value="block.title"
        type="text"
        class="w-full text-xl mb-1"
        @change="(e) => {
          const blocks = JSON.parse(JSON.stringify(metafieldBlocks))
          blocks[blockIndex].title = e.target.value
          metafieldBlocks = blocks
        }"
      />
      <Editor 
        :content="block.content"
        :slim="true"
        class="py-1 w-full"
        @update="(e) => {
          const blocks = JSON.parse(JSON.stringify(metafieldBlocks))
          blocks[blockIndex].content = e
          metafieldBlocks = blocks
        }"
      />
    </Card>
  </draggable>

  <gButton 
      v-if="metafieldBlocks && metafieldBlocks.length"
      class="add-item-button w-full py-3 mb-2 border-2 border-gray-500 border-opacity-20 hover:border-opacity-100 hover:border-red-400 text-red-400 hover:bg-red-400 hover:text-red-900"
      @click="addItems(true)"
      >
      <Icon name="add" />
    </gButton>

  <gModal 
    :ref="'modelSelectImageIndex'"
    name="modelSelectImageIndex"
    variation="popover"
    :style="{'top': modalTopOffset}"
    :disable-body-scroll="false"
    :classes="{
      overlay: 'bg-white dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-50 transition ease-out duration-100',
      wrapper: 'bg-transparent shadow-none absolute',
      modal: 'bg-gray-100 dark:bg-gray-800 left-4 shadow-lg max-w-sm transition-all ease-out duration-200 delay-100 ',
      header: 'bg-transparent',
      footer: 'bg-transparent',
      body: 'p-6',
      close: 'rounded-md shadow-xl absolute -right-1 -top-1 h-10 w-10 bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 bg-opacity-90 hover:bg-white hover:bg-opacity-100 text-red-400',
      enterClass: 'opacity-0 scale-0',
      enterToClass: 'opacity-50 scale-100',
      overlayEnterActiveClass: '',
      overlayLeaveClass: 'opacity-50',
      overlayLeaveActiveClass: '',
      overlayLeaveToClass: 'opacity-0',
    }"
    @after-close="selectingImageBlockIndex = null">
    <div class="select-product-images grid grid-cols-2 gap-2 max-h-[60vh] min-h-24 overflow-y-scroll">
        <gButton 
          v-for="(image, imgIndex) in images"
          :key="image.url"
          :class="{
            'col-span-1 p-0 hover:scale-95 hover:opacity-90': true,
            'selected border-purple-500 border-2': typeof selectingImageBlockIndex === 'number' && metafieldValue.blocks[selectingImageBlockIndex].image_index === imgIndex
          }"
          @click="() => {
            if(typeof selectingImageBlockIndex === 'number' ) {
              const blocks = JSON.parse(JSON.stringify(metafieldBlocks))
              blocks[selectingImageBlockIndex].image_index = imgIndex;
              metafieldBlocks = blocks
            }
            $refs.modelSelectImageIndex.hide()
          }">
          <Media 
            class="w-full h-full rounded shadow-md max-w-sm max-h-[380px] m-0"
            :media="image"
            :is-background="true"
            ratio="1:1"
          />
        </gButton>
      </div>
  </gModal>
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
      modalTopOffset: '200px',
    }
  },
  computed: {
    isProductPage() {
      return !!this.$route.params?.handle?.length
    },
    product() {
      try {
          return this.isProductPage 
            ? this.$store.state.productPage[this.env]?.product
            : this.$store.state.productCreate?.product
        } catch {
          return null
        }
    },
    images() {
      return this.product?.images || []
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
        return this.isProductPage 
          ? this.$store.dispatch('productPage/setMetafield', { env: this.env, metafield })
          : this.$store.commit('productCreate/setMetafield', { metafield })
      }
    },
    metafieldBlocks: {
      get() {
        try {
          return this.metafieldDoc?.value?.blocks
        } catch {
          return []
        }
      },
      set(blocks) {
        const metafield = {key: this.key, namespace: this.namespace, ...(![undefined, null].includes(this.metafieldDoc) ? this.metafieldDoc : {})}
        const value = ![undefined, null].includes(metafield.value) ? metafield.value : {}
        this.isProductPage 
          ? this.$store.dispatch('productPage/setMetafield', { env: this.env, metafield: { ...metafield, value: { ...value, blocks } } })
          : this.$store.commit('productCreate/setMetafield', { metafield: { ...metafield, value: { ...value, blocks } } })
        // this.metafieldDoc = metafieldDoc
      }
    },
    metafieldValue: {
      get() {
        try {
          return this.$store?.state?.productPage[this.env]?.metafields[this.keyPath]?.value
        } catch {
          return null
        }
      },
      set(value) {
        const metafield = {key: this.key, namespace: this.namespace, ...(![undefined, null].includes(this.metafieldDoc) ? this.metafieldDoc : {}), value}
        this.isProductPage 
          ? this.$store.dispatch('productPage/setMetafield', { env: this.env, metafield })
          : this.$store.commit('productCreate/setMetafield', { metafield })
        // this.metafieldDoc = metafieldDoc
      }
    }
  },
  
  mounted()  {
    const { env, namespace, key } = this
    if(this.isProductPage) {
      setTimeout(() => {
        this.$store.dispatch('productPage/getMetafield', { env, namespace, key, handle: this.product.handle })
          .then(console.log)
      }, 500)
    }
  },

  methods: {
    addItems(append = false) {
      const blocks = !Array.isArray(this.metafieldBlocks) ? [] : JSON.parse(JSON.stringify(this.metafieldBlocks))
      const newBlock = {
        title: 'New...',
        content: '',
        image_index: null
      }
      this.metafieldValue = { blocks: append ? [...blocks, newBlock] : [newBlock, ...blocks] };
      setTimeout(() => {
        window.scrollTo({top: this.$el.offsetTop + (append ? this.$el.offsetHeight : 0), left: 0, behavior: 'smooth'});
      }, 250)
    },
    selectImageIndex(e, blockIndex) {
      this.$refs.modelSelectImageIndex.show()
      this.selectingImageBlockIndex = blockIndex
      setTimeout(() => {
        this.$refs.modelSelectImageIndex._vnode.elm.querySelector('.modal-wrapper').style.top = `${e.pageY - 200}px`
        setTimeout(() => {
          this.scrollTo('modelSelectImageIndex')
      //   this.$modal.show('modelSelectImageIndex')
        }, 200)
      }, 50)
    },
    scrollTo(refName, offset = 0) {
      const element = this.$refs[refName]?._vnode?.elm || this.$refs[refName];
      const top = element.classList.contains('modal-overlay') ? element.childNodes[0].offsetTop - 200 : element.offsetTop + offset;
      window.scrollTo({top, left: 0, behavior: 'smooth'});
    }
  }
}
</script>