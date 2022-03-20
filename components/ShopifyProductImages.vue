<template>
  <div class="product-images">
    <gButton 
      v-tooltip="'add item'"
      class="add-item-button w-full py-3 mb-2"
      @click="selectImages()"
      >
      <Icon name="add" />
    </gButton>
    <draggable 
      v-model="productImages"
      handle=".product-image"
      @change="(e) => imagesMoved(e)"
      >
        <Card 
          v-for="(image, i) in productImages"
          :key="'image-' + image.src"
          class="w-full mb-2 group"
          card-style="media-left">
          <template #before>
            <ButtonDelete
              class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              @delete="() => {
                const images = JSON.parse(JSON.stringify(productImages));
                images.splice(i, 1);
                productImages = images;
              }"
            />
          </template>
          <template #media>
            <Media 
              class="product-image cursor-move w-full h-full rounded shadow-md max-w-sm max-h-[380px] mx-auto sm:ml-auto sm:mr-0"
              :media="image"
              :is-background="true"
              ratio="1:1"
            />
          </template>
          <gTextarea
            ref="imgTextareas"
            :value="image.alt"
            :name="'image-' + i + '-alt'"
            @input="(e) => {
              const _product = JSON.parse(JSON.stringify(product));
              _product.images[i].alt = e;
              product = _product
            }"
          />
        </Card>
    </draggable>
    
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { capitalize } from '~/utils/funcs';

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
    return {
      images: Array.isArray(this.productImages) ? this.productImages : [],
      selectingImages: false,
      appendImages: false
    }
  },
  computed: {
    product: {
      get() {
        try {
          return this.$store?.state?.productPage[this.env]?.product || null
        } catch {
          return null
        }
      },
      set(product) {
        this.$store.dispatch('productPage/setProduct', { env: this.env, product })
      }
    },
    productImages: {
      get() {
        try {
          return this.$store?.state?.productPage[this.env]?.product?.images || null
        } catch {
          return null
        }
      },
      set(images) {
        const product = {...JSON.parse(JSON.stringify(this.product)), images: images.map((image, i) => {
          return {
            ...image,
            position: i + 1
          }
        })};
        this.product = product
        
      }
    }
  },
  methods: {
    selectImages(append = false) {
      this.appendImages = append
      this.$store.commit('algoliaSelect/open', { props: {
        indexName: `media`,
        selecting: {
          multiple: true
        }
      }, 
        onSubmit: this.addImages.bind(this)
      })
      // this.selectingImages = false
      // setTimeout(() => {
      //     this.selectingImages = true
      //   }, !this.selectingImages ? 0 : 100)
    },
    addImages(selectedImages) {
      const newImages = selectedImages.map(img => {
        const alt = ['fits', 'materials', 'washes', 'colors', 'styles'].reduce((acc, key) => {
          const keySingular = key[key.length - 1] === 's' ? key.substring(0, key.length - 1) : key;
          if (!img[key]?.length) { return acc }
          return `${acc}${acc?.length ? ' ' : ''}${capitalize(keySingular)}: ${img[key]
            .map(val => val.split(' ')
              .map(word => capitalize(word)).join(' ')
            ).join(' + ')}`
        }, '')
        const { downloadUrl: src } = img;
        return { src, alt }
      })
      this.productImages = (this.appendImages ? [...this.productImages, ...newImages] : [...newImages, ...this.productImages])
        .map((img, i) => {
          return { ...img, position: i + 1 }
        });
    },
    imagesMoved() {
      console.log('images moved')
    }
  }
}
</script>