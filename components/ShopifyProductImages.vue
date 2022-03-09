<template>
  <div class="product-images">
    <draggable 
      v-model="images"
      handle=".product-image"
      @change="(e) => imagesMoved(e)"
      >
        <Card 
          v-for="(image, i) in images"
          :key="'image-' + image.id"
          class="w-full mb-2 group"
          card-style="media-left">
          <template #before>
            <ButtonDelete
              class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              @delete="() => {
                images.splice(i, 1);
                $emit('update', images);
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
    imagesMoved() {
      this.$emit('update', this.images)
    }
  }
}
</script>