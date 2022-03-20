<template>
  <gModal v-model="show" 
    class="product-save"
    :classes="{
        overlay: 'bg-gray-100 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90',
        wrapper: 'max-w-sm',
        modal: 'bg-gray-50 dark:bg-gray-800',
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
      @opened="onOpen"
      @closed="onClose"
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
        <small class="text-gray-400 dark:text-600 text-sm">
          {{ envs.to === envs.from ? 'saving to' : 'to'}}
        </small> 
        <strong 
          v-for="env in envs.to"
          :key="env"
          :class="{
            'uppercase': true,
            'text-purple-400': env === 'dev',
            'text-red-400': env === 'live',
          }">
          {{ env }}
        </strong>
      </gTag>

      <div v-if="state === 'selecting'"
        class="mx-auto max-w-[260px]">

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
            class="flex flex-col content-start items-stretch space-y-3 mb-2">
              <div 
                v-for="env in envs.to"
                :key="env"
                class="p-3 flex flex-col space-y-2">
                <small class="uppercase">{{ env }}:</small>
                <a :href="links[env].admin" class="w-full" target="_blank">
                  <gButton 
                    class="w-full text-blue-400 hover:bg-blue-400 hover:text-blue-900">
                    View In Shopify
                  </gButton>
                </a>
                <a :href="links[env].frontend" class="w-full" target="_blank">
                  <gButton 
                    class="w-full text-cyan-400 hover:bg-cyan-400 hover:text-cyan-900">
                    View on Site
                  </gButton>
                </a>
              </div>
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
            @click="show = false">
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
import { ShopEnv } from '~/models/shopify.models'
import { asyncDelay } from '~/utils/funcs'
import {shopAdminDomains, shopDomains} from '~/utils/shopify'

export default {
  components: {
    RadialProgressBar
  },
  data() {
    return {
      state: 'confirming', /* confirming, selecting, saving, saved */
      saved: [],
      shouldSave: [],
      errors: []
    }
  },
  computed: {
    products() {
      return {
        [ShopEnv.LIVE]: this.$store.state.productPage[ShopEnv.LIVE].product,
        [ShopEnv.DEV]: this.$store.state.productPage[ShopEnv.DEV].product,
      }
    },
    metafields() {
      return {
        [ShopEnv.LIVE]: this.$store.state.productPage[ShopEnv.LIVE].metafields,
        [ShopEnv.DEV]: this.$store.state.productPage[ShopEnv.DEV].metafields,
      }
    },
    envs() {
      return {
        from: this.$store.state.productPage.saving.from,
        to: this.$store.state.productPage.saving.to
      }
    },
    shouldSaveOptions() { 
      return [
        { text: 'Content (title, text, tags)', value: 'info' },
        { text: 'Images', value: 'images' },
        { text: 'Product Details', value: 'studio.product_details' },
        { text: 'Featured Reviews', value: 'studio.featured_reviews' },
        { text: 'The Look', value: 'studio.the_look' }
      ]
    },
    show: {
      get() {
        return Array.isArray(this.$store.state.productPage.saving.to) && this.$store.state.productPage?.saving?.from?.length > 0
      },
      set(val) {
        if (val === true) { return }
        this.$store.commit('productPage/saving', { to: null, from: null })
      }
    },
    links() {
      return {
        [ShopEnv.LIVE]: {
          admin: this.products[ShopEnv.LIVE] ? `${shopAdminDomains[ShopEnv.LIVE]}/products/${this.products[ShopEnv.LIVE].id}` : null,
          frontend:  this.products[ShopEnv.LIVE] ? `${shopDomains[ShopEnv.LIVE]}/products/${this.products[ShopEnv.LIVE].handle}` : null
        },
        [ShopEnv.DEV]: {
          admin: this.products[ShopEnv.DEV] ? `${shopAdminDomains[ShopEnv.DEV]}/products/${this.products[ShopEnv.DEV].id}` : null,
          frontend:  this.products[ShopEnv.DEV] ? `${shopDomains[ShopEnv.DEV]}/products/${this.products[ShopEnv.DEV].handle}` : null
        }
      }
    },
  },
  methods: {
    async save() {
      this.state = 'saving';
      const {errors, saved} = await this.$store.dispatch('productPage/save', {shouldSave: this.shouldSave});
      this.errors = errors
      this.saved = saved
      this.state = 'saved';
      await asyncDelay(500);
      this.$store.dispatch('productPage/getChanges', 'live');
      this.$store.dispatch('productPage/getChanges', 'dev');
    },
    // async saveProduct() {
    //   const product = this.shouldSave.includes('info') 
    //     ? {
    //       title: this.products[this.envs.from].title,
    //       tags: this.products[this.envs.from].tags,
    //       body_html: this.products[this.envs.from].body_html,
    //     }
    //     : {};
    //   if (this.shouldSave.includes('images')) {
    //     product.images = this.products[this.envs.from].images
    //   }
    //   if (!Object.keys(product)?.length) {
    //     return
    //   }

    //   return await Promise.all(this.envs.to.map(env => {
    //     const data = {...product, id: this.products[env].id}
    //     console.log(data)
    //     return this.$shops[env].put({ path: `products/${this.products[env].id}`, data  })
    //       .then(() => ['info','images'].filter(k => this.shouldSave.includes(k)).forEach(k => this.saved.push(k)))
    //       .catch(err => {
    //         console.error(err)
    //         this.errors.push(err)
    //       })
    //   }))
    // },
    onClose() {
      this.$store.commit('productPage/saving', { to: null, from: null })
    },
    onOpen() {
      this.state = this.envs.to?.length === 1 && this.envs.from === this.envs.to[0] ? 'selecting' : 'confirming'
      this.shouldSave = this.shouldSaveOptions
        .filter((option) => 
          this.$store.state.productPage[this.envs.from]?.changes?.metafields?.includes(option.value)
          || this.$store.state.productPage[this.envs.from]?.changes?.product?.includes(option.value))
        .map(o => o.value)
    },
    getMissing(env) {
      return Promise.all([
        (async() => {
          try {
            if ([null, undefined, {}].includes(this.products[env]) && env !== this.envs.from) {
              this.products[env] = await this.$shops[env].get({ path: `/products/${this.products[env].id}`, query: { fields: 'title,id,images,body_html,tags' } })
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
              await this.$db.collection(`products_${env}/${this.products[env].handle}/metafields`)
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