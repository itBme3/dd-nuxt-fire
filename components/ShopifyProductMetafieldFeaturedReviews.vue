<template>
  <div class="metafield-featured-reviews">
    <gButton 
      class="add-item-button w-full py-3 mb-2 border-2 border-gray-500 border-opacity-20 hover:border-opacity-100 hover:border-cyan-300 text-cyan-300 hover:bg-cyan-300 hover:text-cyan-900"
      @click="addItems()"
      >
      <Icon name="add" />
    </gButton>

    <draggable 
      v-model="metafieldValue"
    >
      <Card
        v-for="(review, reviewIndex) in metafieldValue"
        :key="review.content + '-' + review.title"
        :ref="key + reviewIndex"
        class="w-full mb-2 hover:scale-100 relative group overflow-visible"
        :classes="{ media: 'flex items-stretch content-center' }">
        <template #after>
          <ButtonDelete
            class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            @delete="() => {
              const val = JSON.parse(JSON.stringify(metafieldValue))
              val.splice(reviewIndex, 1);
              metafieldValue = val
            }"
          />
        </template>
        
        <!-- <Editor 
          :content="review.title"
          :slim="true"
          min-height="auto"
          class="review-title py-1 w-full min-h-8"
          @update="(e) => {
            const val = JSON.parse(JSON.stringify(metafieldValue))
            val[reviewIndex].title = e;
            metafieldValue = val
          }"
        /> -->

        <gInput 
          :value="review.title"
          class="text-xl sm:text-3xl mb-2"
          @input="lodash.debounce((e) => {
            const val = JSON.parse(JSON.stringify(metafieldValue))
            val[reviewIndex].title = e;
            metafieldValue = val
          }, 500)" />

        <Editor 
          :content="review.body"
          :slim="true"
          class="review-body py-1 w-full"
          min-height="auto"
          @update="lodash.debounce((e) => {
            const val = JSON.parse(JSON.stringify(metafieldValue))
            val[reviewIndex].body = e;
            metafieldValue = val
          }, 500)"
        />
        <i class="text-gray-500 block mt-3">{{ review.reviewer }}</i>
      </Card>
    </draggable>

    <gButton 
      v-if="metafieldValue && metafieldValue.length"
      class="add-item-button w-full py-3 mb-2 border-2 border-gray-500 border-opacity-20 hover:border-opacity-100 hover:border-cyan-300 text-cyan-300 hover:bg-cyan-300 hover:text-cyan-900"
      @click="addItems(true)"
      >
      <Icon name="add" />
    </gButton>

  </div>
</template>

<script>
import _ from 'lodash';
import draggable from 'vuedraggable'
import { stripHtml } from '~/utils/funcs';

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
    const key = 'featuredReviews';
    return {
      lodash: _,
      namespace, key,
      keyPath: `${namespace}.${key}`
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
        const metafield = {
          key: this.key, 
          namespace: this.namespace,
          ...(![undefined, null].includes(this.metafieldDoc) ? this.metafieldDoc : {}), 
          value: value?.map(review => {
            return {
              ...review, title: stripHtml(review.title)
            }
          })
        }
        this.$store.commit('productCreate/setMetafield', { metafield })
      }
    }
  },
  mounted()  {
    const { env, namespace, key } = this
    console.log({keyPath: this.keyPath} )
    if (this.isProductPage) {
      this.$store.dispatch('productPage/getMetafield', { env, namespace, key, handle: this.product.handle })
    }
  },
  methods: {
    addItems(append = false) {
      this.$store.commit('algoliaSelect/open', { 
        props: { indexName: 'reviews' },
        onSubmit: (selection) => {
          if (Array.isArray(selection)) {
            console.log( { selection } )
            // const value = Object.assign({}, value, this.metafieldValue)
            const newItems = selection.map(review => {
              const { title, content: body, score, id, name: reviewer, created_at: date } = review;
              return { title: stripHtml(title), body, score, id, reviewer, date }
            })
            const value = !Array.isArray(this.metafieldValue) ? [] : JSON.parse(JSON.stringify(this.metafieldValue))
            this.metafieldValue = append 
              ? [...value, ...newItems]
              : [...newItems, ...value]
            console.log({ $el: this.$el })
            setTimeout(() => {
              window.scrollTo({top: this.$el.offsetTop + (append ? this.$el.offsetHeight : 0), left: 0, behavior: 'smooth'});
            }, 250)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .featured-reviews {
    .editor {
      &.review-title {
        .ProseMirror {
          --editor-min-height: auto !important;
        }
      }
    }
  }
</style>