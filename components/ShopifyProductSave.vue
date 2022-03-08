<template>
  <gModal v-model="showing" 
    class="product-save"
    :classes="{
        overlay: 'bg-gray-100 dark:bg-gray-900 bg-opacity-90',
        wrapper: 'max-w-sm',
        modal: 'bg-transparent',
        header: 'border-gray-100',
        footer: 'bg-transparent',
        close: 'rounded-md shadow-xl absolute right-0 top-0 h-12 w-12 bg-gray-300 bg-opacity-5 hover:bg-gray-300 hover:bg-opacity-10 text-red-400',
        overlayEnterClass: 'opacity-0',
        overlayEnterActiveClass: 'transition ease-out duration-100',
        overlayEnterToClass: 'opacity-100',
        overlayLeaveClass: 'opacity-100',
        overlayLeaveActiveClass: 'transition ease-in duration-75',
        overlayLeaveToClass: 'opacity-0',
      }"
      @opened="() => state = envs.from === envs.to ? 'selecting' : 'confirming'"
      >

    <template #header>
      <small class="text-green-400">saving product</small>
    </template>

    <h3 
      v-if="!products[envs.from] || !products[envs.from].handle || !products[envs.from].id" class="text-red-500">
      Issue with product data
      <Codeblock>{{ JSON.stringify(products[envs.from], null, 2) }}</Codeblock>
    </h3>
    <template v-else>

      <gTag 
        v-if="state !== 'saving'"
        :tag-name="state === 'confirming' ? 'h1' : 'h4'"
        :class="{
          'from-to-envs my-6 mx-auto': true,
          'max-w-[260px] text-left': state !== 'confirming',
          'text-center': state === 'confirming'
        }">
        <template v-if="envs.from !== envs.to">
          <small class="text-gray-400 dark:text-600 text-sm">from:</small> 
          <strong :class="{
            'uppercase': true,
            'text-purple-400': envs.from === 'dev',
            'text-red-400': envs.from === 'live',
          }">{{ envs.from }}</strong>
        </template>
        <small class="text-gray-400 dark:text-600 text-sm">{{ envs.to === envs.from ? 'saving to' : 'to'}}</small> 
        <strong :class="{
          'uppercase': true,
          'text-purple-400': envs.to === 'dev',
          'text-red-400': envs.to === 'live',
        }">{{ envs.to }}</strong>
        <small class="text-gray-400 dark:text-600 text-sm">site</small> 
      </gTag>

      <div v-if="state === 'selecting'"
        class="mx-auto max-w-[260px]">

        <!-- <gCheckbox wrapped 
          label="save everything:"
          name="save-all"
          :checked="shouldSave.length >= shouldSaveOptions.length"
          @input="(e) => !e ? shouldSave = [] : shouldSave = shouldSaveOptions.map(itm => itm.value)"
        /> -->
        <small class="block text-gray-400 dark:text-gray-600 mb-3 uppercase">should save:</small>
        <gCheckboxGroup
          v-model="shouldSave"
          name="should-save"
          class="mb-6"
          :options="shouldSaveOptions"
        />

      </div>

      <template v-if="state === 'saving'">

        <div class="bg-white bg-opacity-20 dark:bg-gray-800 absolute inset-0 z-99999 flex items-center content-center py-8">
          <radial-progress-bar
            :diameter="200"
            :completed-steps="saved.length"
            :total-steps="shouldSave.length"
            inner-stroke-color="#111827"
            class="mx-auto my-8">
            <p>saving</p>
          </radial-progress-bar>
        </div>

      </template>

      <template v-if="state === 'saved'">

        <div 
          v-if="errors.length === 0"
          class="success">
          <h2 class="text-gray-500 mx-auto mb-6 max-w-[260px]">
            Saved {{ products[envs.from].title }} 👍
          </h2>
        </div>
        <div 
          v-else
          class="errors">
          <h3 class="text-red-500">ERRORS:</h3>
          <small>( check console for more info )</small>
          <ul>
            <li v-for="(error, i) in errors"
              :key="'error-' + i">
              {{ error }}
            </li>
          </ul>
        </div>

      </template>
    </template>

    <template #footer>
      <!-- <template 
        v-if="products[envs.from] && !products[envs.from]?.handle && !products[envs.from]?.id"> -->

        <client-only>
          <div v-if="state === 'saved'"
            class="flex flex-col content-start items-stretch space-y-2 mb-2">

              <a :href="links.admin" class="w-full" target="_blank">
                <gButton 
                  class="w-full text-blue-400 hover:bg-blue-400 hover:text-blue-900">
                  View In Shopify
                </gButton>
              </a>
              <a :href="links.frontend" class="w-full" target="_blank">
                <gButton 
                  class="w-full text-cyan-400 hover:bg-cyan-400 hover:text-cyan-900">
                  View on Site
                </gButton>
              </a>

          </div>
        </client-only>

        <div class="flex content-end items-center space-x-2">
          
          <gButton 
            v-if="state === 'confirming'"
            class="w-full hover:bg-blue-500 hover:text-blue-900"
            @click="state = 'selecting'">
            Continue
          </gButton>
          <gButton 
            v-if="!['confirming','saving', 'saved'].includes(state)"
            :class="{
              'w-full': true,
              'text-red-400 hover:bg-red-400 hover:text-red-900': ['confirming', 'selecting'].includes(state),
              'text-blue-400 hover:bg-blue-400 hover:text-blue-900': state === 'saved'
            }"
            @click="showing = false">
            {{ ['confirming', 'selecting'].includes(state) ? 'cancel' : 'done' }}
          </gButton>
          <gButton 
            v-if="state === 'selecting'"
            class="w-full bg-blue-500 text-blue-900 hover:text-green-900 hover:bg-green-400"
            @click="save()">
            save
          </gButton>

        </div>

      <!-- </template> -->
    </template>

  </gModal>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress'
import { FireDb } from '~/utils/firebase'
import {shopAdminDomains, shopDomains, Shopify} from '~/utils/shopify'

export default {
  components: {
    RadialProgressBar
  },
  props: {
    liveProduct: {
      type: Object,
      default: () => null
    },
    devProduct: {
      type: Object,
      default: () => null
    },
    liveMetafields: {
      type: Object,
      default: () => null
    },
    devMetafields: {
      type: Object,
      default: () => null
    },
    fromEnv: {
      type: String,
      default: null
    },
    toEnv: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const app = { $fire: this.$fire }
    return {
      state: 'confirming', /* confirming, selecting, saving, saved */
      showing: this.show,
      shops: {
        live: new Shopify({ app, env: 'live' }),
        dev: new Shopify({ app, env: 'dev' }),
      },
      db: new FireDb(app),
      products: {
        dev: this.devProduct,
        live: this.liveProduct
      },
      metafields: {
        dev: this.devMetafields, /* is object with docId as key */
        live: this.liveMetafields /* is object with docId as key */
      },
      currentProducts: {
        live: null,
        dev: null
      },
      currentMetafields: {
        live: null,
        dev: null
      },
      saved: [],
      shouldSave: [],
      errors: []
    }
  },
  computed: {
    envs() {
      return {
        from: this.fromEnv,
        to: this.toEnv
      }
    },
    links() {
      return {
        admin: `${shopAdminDomains[this.envs.to]}/products/${this.products[this.envs.to].id}`,
        frontend: `${shopDomains[this.envs.to]}/products/${this.products[this.envs.to].handle}`
      }
    },
    shouldSaveOptions() { 
      return [
        { text: 'Content (title, text, tags)', value: 'title,body_html,tags' },
        { text: 'Images', value: 'images' },
        { text: 'Product Details', value: 'metafield:product_details' },
        { text: 'Featured Reviews', value: 'metafield:featured_reviews' },
        { text: 'The Look', value: 'metafield:the_look' }
      ].filter((option) => {
        if (option.value.includes('metafield:')) {
          return !!this.metafields[this.envs.from] && this.metafields[this.envs.from][option.value.split(':')[1]]?.docId
        }
        if (option.value === 'images') {
          return this.products[this.envs.from] && this.products[this.envs.from]?.images?.length
        }
        const contentKeys = option.value.split(',');
        return !!Object.keys(this.products[this.envs.from]).filter(k => contentKeys.includes(k))?.length
      })
    }
  },
  watch: {
    liveProduct(value) {
      this.products.live = value
      setTimeout(() => {this.shouldSave = this.shouldSaveOptions.map(x => x.value)}, 500)
    },
    devProduct(value) {
      this.products.dev = value
      setTimeout(() => {this.shouldSave = this.shouldSaveOptions.map(x => x.value)}, 500)
    },
    liveMetafields(value) {
      this.metafields.live = value
      setTimeout(() => {this.shouldSave = this.shouldSaveOptions.map(x => x.value)}, 500)
    },
    devMetafields(value) {
      this.metafields.dev = value
      setTimeout(() => {this.shouldSave = this.shouldSaveOptions.map(x => x.value)}, 500)
    },
    show(value) {
      this.showing = value
      setTimeout(() => {
        if (this.envs.from === this.envs.to) { 
          this.state = 'selecting'
        }
      }, 500);
    },
    showing(value) {
      this.$emit('isOpen', value)
    }
  },
  created() {
    setTimeout(() => {
      this.shouldSave = this.shouldSaveOptions.map(itm => itm.value)
      console.log({ metafields: this.metafields, liveMetafields: this.liveMetafields, shouldSave: this.shouldSave })
    }, 500);
  },
  methods: {
    save() {
      this.state = 'saving'
        for (let i = 0; i < this.shouldSave.length; i++) {
          setTimeout(() => {
            this.saved.push(i);
            if(this.saved.length === this.shouldSave.length) {
              this.state = 'saved'
            };
          }, 500 * i)
        }
    },
    getMissing(env) {
      return Promise.all([
        (async() => {
          try {
            if ([null, undefined, {}].includes(this.products[env]) && env !== this.envs.from) {
              this.products[env] = await this.shops[env].get({ path: `/products/${this.products[env].id}`, query: { fields: 'title,id,images,body_html,tags' } })
            }
          } catch (err) {
            console.error(err);
            this.errors.push(`Getting missing ${env} product: ${err.message}`)
          }
        })(),
        (async () => {
          try {
            const missingMetafields = ['product_details', 'featured_reviews', 'the_look'].filter(k => !this.metafields[env][k] || !this.metafields[env][k]?.key);
            if (missingMetafields.length > 0) {
              await this.db.collection(`products_${env}/${this.products[env].handle}/metafields`)
                .where( 'docId', 'in', missingMetafields )
                .then(docs =>
                  docs.forEach(doc => {
                    if(!doc?.value) { return }
                    this.metafields[emv][doc.docId] = doc
                  })
                )
            } 
          } catch (err) {
            console.error(err);
            this.errors.push(`Getting missing ${env} metafields: ${err.message}`)
          }
        })()
      ])
    },
    getCurrent(env) {
      return Promise.all([
        this.shops[env].get({ path: `/products/${this.products[env].id}`, query: { fields: 'title,id,handle,images,body_html,tags' } })
          .then(res => {
            this.currentProducts[env] = res.data.body?.product;
            return res
          }).catch(err => {
            console.error(err);
            this.errors.push(`Getting current ${env} product: ${err.message}`)
            return undefined
          }),
        this.db.collection(`products_${env}/${this.products[env].handle}/metafields`)
          .then(docs => {
            this.currentMetafields[env] = {
              product_details: docs.filter(d => d.docId === 'product_details')[0],
              featured_reviews: docs.filter(d => d.docId === 'featured_reviews')[0],
              the_look: docs.filter(d => d.docId === 'the_look')[0],
            }
          })
          .catch(err => {
            console.error(err);
            this.errors.push(`Getting current ${env} product: ${err.message}`)
            return { product_details: undefined, featured_reviews: undefined, the_look: undefined }
          })
      ])
    }
  }
}
</script>

<style lang="scss">
  .modal-footer {
    .button {
      @apply py-3;
    }
  }
</style>