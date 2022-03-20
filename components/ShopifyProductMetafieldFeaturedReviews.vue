<template>
  <div class="metafield-featured-reviews">
    <gButton 
      v-tooltip="'add item'"
      class="add-item-button w-full py-3 mb-2"
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
        
        <Editor 
          :content="review.title"
          :slim="true"
          min-height="auto"
          class="py-1 w-full min-h-8"
          @update="(e) => {
            const val = JSON.parse(JSON.stringify(metafieldValue))
            val[reviewIndex].title = e;
            metafieldValue = val
          }"
        />
        <Editor 
          :content="review.body"
          :slim="true"
          class="py-1 w-full"
          min-height="auto"
          @update="(e) => {
            const val = JSON.parse(JSON.stringify(metafieldValue))
            val[reviewIndex].body = e;
            metafieldValue = val
          }"
        />
        <i class="text-gray-500 block mt-3">{{ review.reviewer }}</i>
      </Card>
    </draggable>

    <gButton 
      v-if="metafieldValue && metafieldValue.length"
      v-tooltip="'add item'"
      class="add-item-button w-full py-3 mb-2"
      @click="addItems(true)"
      >
      <Icon name="add" />
    </gButton>

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
    const key = 'featuredReviews';
    return {
      namespace, key,
      keyPath: `${namespace}.${key}`
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
        this.$store.dispatch('productPage/setMetafield', { env: this.env, metafield })
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
    }
  },
  mounted()  {
    const { env, namespace, key } = this
    this.$store.dispatch('productPage/getMetafield', { env, namespace, key, handle: this.product.handle })
  },
  methods: {
    addItems(append = false) {
      
      this.$store.commit('algoliaSelect/open', { 
        props: { indexName: 'reviews' },
        onSubmit: (selection) => {
          if (Array.isArray(selection)) {
            // const value = Object.assign({}, value, this.metafieldValue)
            const newItems = selection.map(review => {
              const { title, content: body, score, id, name: reviewer, created_at: date } = review;
              return { title, body, score, id, reviewer, date }
            })
            this.metafieldValue = append 
              ? [...this.metafieldValue, ...newItems]
              : [...newItems, ...this.metafieldValue]
          }
        }
      })
    }
  }
}
</script>