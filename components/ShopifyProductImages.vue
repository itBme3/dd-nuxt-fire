<template>
  <div class="product-images">
    <draggable 
      v-model="images"
      handle=".product-image"
      @change="(e) => imagesDragged(e)"
      >
        <Card 
          v-for="(image, i) in images"
          :key="'image-' + image.id"
          class="w-full mb-2"
          card-style="media-left">
          <template #media>
            <Media 
              class="product-image w-full h-full rounded shadow-md max-w-sm max-h-[380px] mx-auto sm:ml-auto sm:mr-0"
              :media="image"
              :is-background="true"
              ratio="1:1"
            />
          </template>
          <gTextarea
            ref="imgTextareas"
            v-model="image.alt"
            :name="'image-' + i + '-alt'"
            @input="(e) => {
              images[i].alt = e;
              $emit('update', images)
            }"
          />
        </Card>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
// import { moveItemInArray } from '~/utils/funcs'

export default {
  components: {
    draggable
  },
  props: {
    productImages: {
      type: Array,
      default: () => null
    }
  },
  data() {
    return {
      images: Array.isArray(this.productImages) ? this.productImages : []
    }
  },
  watch: {
    productImages(value) {
      const images = Array.isArray(value) ? value : [];
      for (let i = 0; i < images.length; i++) {
        images[i].position = i + 1
      }
      this.images = images
    }
  },
  methods: {
    imagesDragged() {
      this.$emit('update', this.images)
    }
  }
}
</script>