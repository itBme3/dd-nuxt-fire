<template>
  <div class="product-metafields">
      <div class="metafield-tabs flex content-start items-center space-x-2 mb-3">

        <gButton 
          v-for="obj in metafieldObjs"
          :key="obj.label"
          :class="{
            'hover:bg-red-400 hover:text-red-900': true,
            'bg-red-400 text-red-900': viewing === obj.label
          }"
          @click="viewing = obj.label">
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
            
          <template v-if="obj.label === 'Product Details'">
            <Card
              v-for="block in obj.doc.value.blocks"
              :key="obj.label + '-' + block.title"
              class="w-full mb-2"
              card-style="media-left">
              <template #media>
                <Media 
                  class="product-image w-full h-full rounded shadow-md max-w-sm max-h-[380px] mx-auto sm:ml-auto sm:mr-0"
                  :media="images[block.image_index]"
                  :is-background="true"
                  ratio="1:1"
                />
              </template>
              <gInput 
                :value="block.title"
                type="text"
                class="w-full"
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
          </template>

          <template v-if="obj.label === 'Featured Reviews'">
            <code>todo: featuredReviews</code>
          </template>

          <template v-if="obj.label === 'Complete The Look'">
            <code>todo: the_look</code>
          </template>

        </template>
      </div>
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
      :show="searchAlgolia"
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
import { FireDb } from '~/utils/firebase'
import { handleize } from '~/utils/funcs'
export default {
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
      images: this.productImages
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
      console.log({docPath})
      const doc = await this.db.doc(docPath).then(res => {
        if(res?.key) {
          return res
        }
        console.log({res})
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