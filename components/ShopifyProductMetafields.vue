<template>
  <div class="product-metafields">
      <div 
        ref="metafieldTabs"
        class="metafield-tabs flex content-start items-center space-x-2 mb-3">

        <gButton 
          v-for="obj in metafieldObjs"
          :key="obj.label"
          :class="{
            'hover:bg-red-400 hover:text-red-900': true,
            'bg-red-400 text-red-900': viewing === obj.label
          }"
          @click="viewing = obj.label; scrollTo('metafieldTabs', -100)">
          {{ obj.label }}
        </gButton>

      </div>

      <div class="metafield-panels">
        
        <gButton 
          v-tooltip="'add item'"
          class="add-item-button w-full py-3 mb-2"
          @click="addItem(null, true)"
          >
          <Icon name="add" />
        </gButton>
        <div 
          v-for="obj in metafieldObjs"
          :key="obj.label + '-panel'"
          :class="{
            'panel max-w-full overflow-x-scroll': true,
            [handleize(obj.label)]: true
          }"
        >
        <template v-if="viewing === obj.label && obj.doc !== null">

            <draggable 
              v-if="obj.label === 'Product Details'"
              v-model="obj.doc.value.blocks"
              @change="$emit('update', obj.doc)"
            >
            <Card
              v-for="(block, blockIndex) in obj.doc.value.blocks"
              :key="obj.label + '-' + block.title"
              :ref="obj.key + blockIndex"
              class="w-full mb-2 hover:scale-100 relative group overflow-visible"
              :classes="{ media: 'flex items-stretch content-center' }"
              card-style="media-left">
              <template #before>
                <ButtonDelete
                  class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                  @delete="() => {
                    obj.doc.value.blocks.splice(blockIndex, 1);
                    $emit('update', obj.doc);
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
                  block.title = e.target.value;
                  $emit('update', obj.doc)
                }"
              />
              <Editor 
                :content="block.content"
                :slim="true"
                class="py-1 w-full"
                @update="(e) => {
                  block.content = e;
                  $emit('update', obj.doc)
                }"
              />
            </Card>
          </draggable>


          <draggable 
            v-if="obj.label === 'Featured Reviews'"
            v-model="obj.doc.value"
            @change="$emit('update', obj.doc)"
          >
            <Card
              v-for="(review, reviewIndex) in obj.doc.value"
              :key="obj.label + '-' + review.title"
              :ref="obj.key + reviewIndex"
              class="w-full mb-2 hover:scale-100 relative group overflow-visible"
              :classes="{ media: 'flex items-stretch content-center' }">
              <template #before>
                <ButtonDelete
                  class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                  @delete="() => {
                    obj.doc.value.splice(reviewIndex, 1);
                    $emit('update', obj.doc);
                  }"
                />
              </template>
              
              <Editor 
                :content="review.title"
                :slim="true"
                min-height="auto"
                class="py-1 w-full min-h-8"
                @update="(e) => {
                  review.title = e;
                  $emit('update', obj.doc)
                }"
              />
              <Editor 
                :content="review.body"
                :slim="true"
                class="py-1 w-full"
                min-height="auto"
                @update="(e) => {
                  review.body = e;
                  $emit('update', obj.doc)
                }"
              />
              <i class="text-gray-500 block mt-3">{{ review.reviewer }}</i>
            </Card>
          </draggable>


          <template v-if="obj.label === 'Complete The Look'">
            <code>todo: the_look</code>
          </template>

        </template>
      </div>
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
                'selected border-purple-500 border-2': typeof selectingImageBlockIndex === 'number' && !!metafieldObjs.filter(obj => obj.label === 'Product Details')[0] && !!metafieldObjs.filter(obj => obj.label === 'Product Details')[0].doc.value.blocks[selectingImageBlockIndex].image_index === imgIndex
              }"
              @click="() => {
                if(typeof selectingImageBlockIndex === 'number' ) {
                  metafieldObjs.filter(obj => obj.label === 'Product Details')[0].doc.value.blocks[selectingImageBlockIndex].image_index = imgIndex;
                }
                $emit('update', metafieldObjs.filter(obj => obj.label === 'Product Details')[0].doc);
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
      <gButton
        v-if="
        (viewing === 'Product Details' && metafieldObjs.filter(obj => obj.label === viewing)[0].doc && metafieldObjs.filter(obj => obj.label === viewing)[0].doc.value && metafieldObjs.filter(obj => obj.label === viewing)[0].doc.value.blocks.length)
          || (['Featured Reviews', 'Complete The Look'].includes(viewing) && metafieldObjs.filter(obj => obj.label === viewing)[0].doc && metafieldObjs.filter(obj => obj.label === viewing)[0].doc.value && metafieldObjs.filter(obj => obj.label === viewing)[0].doc.value.length)
        "
        v-tooltip="'add item'"
        class="add-item-button w-full py-3 mb-2"
        @click="addItem(null)"
        >
        <Icon name="add" />
      </gButton>
    </div>



    <ModalSelectAlgolia
      v-if="searchAlgolia !== null"
      :index-name="searchAlgolia"
      :show="!!searchAlgolia"
      :multiple="true"
      :selecting="{
        identifier: `objectID`,
        hideSideNav: true
      }"
      @submit="(e) => {
        addItem(e, prependSelection)
      }"
    />
    


  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { FireDb } from '~/utils/firebase'
import { handleize } from '~/utils/funcs'

export default {
   components: {
    draggable
  },
  props: {
    env: {
      type: String,
      default: null
    },
    productImages: {
      type: Array,
      default: () => []
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
      viewing: metafieldObjs[0].label,
      db: new FireDb({ $fire: this.$fire }),
      searchAlgolia: null, /* either null or index name — media, reviews, products_{env} */
      prependSelection: false,
      images: this.productImages,
      selectingImageBlockIndex: null,
      modalTopOffset: '200px'
    }
  },
  watch: {
    viewing() {
      this.getMetafieldInFirebase().catch(console.error);
    },
    productImages(value) {
      this.images = value
    },
  },
  mounted() {
    this.getMetafieldInFirebase().catch(console.error);
  },
  methods: {
    handleize,
    async getMetafieldInFirebase() {
      if (this.metafieldObjs.filter(obj => obj.label === this.viewing)[0]?.doc !== null) {
        return
      }
      const metafieldObj = this.metafieldObjs.filter(obj => obj.label === this.viewing)[0];
      const docPath = metafieldObj.docPath;
      const doc = await this.db.doc(docPath).then(res => {
        if(res?.key) {
          return res
        }
        return { 
          key: metafieldObj.key, 
          namespace: metafieldObj.namespace, 
          value: false, 
          docId: docPath.split('/').pop(),
          docPath
        }
      });
      this.metafieldObjs.filter(obj => obj.label === this.viewing)[0].doc = doc;
      return this.$emit('initial', doc);
    },
    addItem(selection = null, prepend = false) {
      const doc = this.metafieldObjs.filter(obj => obj.label === this.viewing)[0]?.doc || { value: this.viewing === 'Product Details' ? { blocks: [] } : [] };
      const unshiftPush = prepend ? 'unshift' : 'push';
      switch (this.viewing) {
        case 'Featured Reviews':
          if(selection === null) {
            this.prependSelection = prepend;
            this.searchAlgolia = 'reviews';
          } else if (Array.isArray(selection)) {
            selection.forEach(doc.value[unshiftPush](selection))
          }
          break;
        case 'Product Details':
          if(!doc?.value?.blocks) {
            doc.value = { blocks: [] }
          }
          doc.value.blocks[unshiftPush]({
            title: '',
            content: '',
            image_index: null
          })
          break;
        case 'Complete The Look':
          if(selection === null) {
            this.prependSelection = prepend;
            this.searchAlgolia = `products_${this.env}`;
          } else if (Array.isArray(selection)) {
            const docValue = typeof doc.value === 'string' ? doc.value.split(', ') : !Array.isArray(doc.value) ? [] : doc.value;
            selection.forEach(docValue[unshiftPush](selection.handle));
            doc.value = docValue.join(', ')
          }
          break;
        default:
          break;
      }
      if (!Array.isArray(selection) && this.viewing !== 'product_details') {
        this.metafieldObjs.filter(d => d.label === this.viewing)[0].doc = doc;
        this.$emit('updateMetafield', doc);
      }
    },
    selectImageIndex(e, blockIndex) {
      console.log({ e, modalRef: this.$refs.modelSelectImageIndex })
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
      console.log({ refs: this.$refs, refName })
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