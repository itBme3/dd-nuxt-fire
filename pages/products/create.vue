<template>
  <div class="products-create max-w-lg mx-auto w-[calc(100%-2em)] pt-6">
    <div class="flex items-center content-between mb-3">
      <h2 class="text-gray-500 text-xl sm:text-2xl md:text-3xl">Create Product:</h2>
      <gButton 
        class="text-green-300 hover:text-green-900 hover:bg-green-300 ml-auto mr-0"
        @click="copyReferenceProduct()"
        >
        Reference
      </gButton>
    </div>
    <!-- <pre class="max-w-lg"><code>{{ JSON.stringify($store.state.productCreate.product.product_type, null, 4) }}</code></pre> -->
    <div class="form rounded-md bg-gray-300 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-60 p-4 mb-4">
      <div
        v-if="touchedErrors.length"
        class="errors text-red-400 rounded p-6 shadow-lg">
        <p v-for="key in Object.keys(touchedErrors)"
          :key="key">
          {{ touchedErrors[key] }}
        </p>
      </div>
      
      <Loading v-if="formState === 'fetching'" />

      <div 
        v-for="key in ['title', 'handle', 'product_type', 'images', 'tags', 'price', 'weight', 'weight_unit', 'metafields', 'body_html']"
        :key="key"
        :class="{
          'form-field': true,
          [key]: true
          }">
          <label :for="'product-' + key">{{key}}:</label>
          <RichSelect
            v-if="key === 'product_type'"
            :options="productTypes"
            :selected="product.product_type"
            :close-on-select="true"
            :multiple="false"
            :variant="'light'"
            :can-create="true"
            :value-attribute="null"
            :text-attribute="null"
            :placeholder="'select product type...'"
            @update="(e) =>{
              log({e});
              updateField('product_type', e)}"
          />

          <ShopifyProductImages v-else-if="key === 'images'" />
          
          <ShopifyProductMetafields v-else-if="key === 'metafields'" />
          
          <ShopifyProductTags v-else-if="key === 'tags'" />

          <Editor 
            v-else-if="fields[key] && fields[key].type === 'richtext'"
            :content="product[key]"
            :name="'product-' + key"
            class="py-1 w-full"
            @update="(e) => updateField(key, e)"
          />

          <gInput 
            v-else-if="!fields[key] || fields[key].type === 'text'"
            :value="product[key]"
            :name="'product-' + key"
            :class="{
              'border-4 border-red-500 border-opacity-100': touched.includes(key) && errors[key] !== undefined
            }"
            @input="(e) => updateField(key, e)"
            @focus="!touched.includes(key) ? touched.push(key) : ''"
            @blur="checkForErrors()"
          />
      </div>

      <div 
        ref="productOptions"
        class="form-field-group options relative mb-6">
        <label v-if="product.options.length" for="product-options">options:</label>

        <ExpansionGroup
          :expanded-index="expandedIndex">
            <ExpansionPanel
              v-for="(option, i) in product.options"
              ref="productOption"
              :key="'option' + (i + 1)"
              :class="{
                'form-field relative group my-2 rounded-lg bg-gray-300 bg-opacity-50 shadow dark:bg-opacity-30 dark:bg-gray-800': true,
                ['option' + (i + 1)]: true
              }"
              :expand="expandedIndex === i"
              @expanded="(expanded) => expandedIndex = !expanded ? null : i">
              
              <template #title>
                <h3 class="font-style-italic">{{ product.options[i].name }}</h3>
              </template>

              <label :for="'product-option' + (i + 1) + '-name'">name:</label>
              <gInput
                :id="'product-option' + (i + 1) + '-name'"
                :value="product.options[i].name"
                @input="(e) => {
                  const options = JSON.parse(JSON.stringify(product.options))
                  options[i].name = e.length === 1 ? capitalize(e) : e
                  updateField('options', options)
                }"
                @keydown="(e) => {
                  log({ e })
                  if(['Enter', 'Tab'].includes(e.key)) {
                    addOptionValue(i)
                  }
                  if (e.key === 'Backspace' && !product.options[i].name.length) {
                    const options = JSON.parse(JSON.stringify(product.options))
                    options.splice(i, 1)
                    updateField('options', options)
                  }
                }"
              />

              <label :for="'product-option' + (i + 1) + '-values'">values:</label>
              <div 
                :id="'product-option' + (i + 1) + '-values'"
                :class="{'option-values': true, ['option-' + (i + 1) + '-values']: true}"
                >
                <div 
                  v-for="(value, valueIndex) in product.options[i].values"
                  :key="'product-option' + (i + 1) + '-value' + valueIndex"
                  :class="{'option-value relative flex items-center content-start mb-2': true}"
                  >
                  <gInput
                    :value="value"
                    :name="'product-option' + (i + 1) + '-value' + valueIndex"
                    @input="(e) => {
                      const options = JSON.parse(JSON.stringify(product.options))
                      options[i].values[valueIndex] = e.replace(',', '').trim()
                      updateField('options', options)
                      if (e.includes(',')) {
                        addOptionValue(i)
                      }
                    }"
                    @keydown="(e) => {
                      if(['Enter', 'Tab'].includes(e.key)) {
                        addOptionValue(i)
                      }
                      if (e.key === 'Backspace' && !product.options[i].values[valueIndex].length) {
                        const options = JSON.parse(JSON.stringify(product.options))
                        options[i].values.splice(valueIndex, 1)
                        updateField('options', options)
                      }
                    }"
                  />

                  <gButton
                    class="icon-button remove-option-value my-0 py-2 hover:bg-red-500 dark:hover:bg-red-500 hover:text-red-900 order-first mr-2"
                    @click="() => {
                      const options = JSON.parse(JSON.stringify(product.options))
                      options[i].values.splice(valueIndex, 1)
                      updateField('options', options)
                    }"
                  >
                    <Icon name="close" />
                  </gButton>
                </div>
              </div>

              <gButton 
                class="add-option-value icon-button"
                @click="addOptionValue(i)"
                >
                <Icon name="add" />
              </gButton>

            <ButtonDelete
              confirm-text="Remove"
              tooltip-text="Remove This"
              class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
              @delete="() => {
                const options = JSON.parse(JSON.stringify(product.options))
                options.splice(i, 1)
                updateField('options', options)
              }"
            />

            </ExpansionPanel>
        </ExpansionGroup>

        <gButton 
          v-if="product.options.length < 3"
          class="bg-gray-300 dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 hover:bg-opacity-100 dark:hover:bg-opacity-100"
          :class="{ 'mt-4': !product.options.length }"
          @click="addOption()"
          >
          {{ product.options.length ? 'add option' : 'add options'}} <Icon class="mr-0 ml-2" name="add" />
        </gButton>
        
      </div>

      <template v-if="product.variants && product.variants.length">
        <label for="excluded-variants" class="text-red-400">excluded variants:</label>
        <LazyRichSelect 
          id="excluded-variants"
          class="excluded-variants mb-6"
          :options="[...variantTitles, ...excludedVariants]"
          :close-on-select="false"
          :selected="excludedVariants"
          :clearable="false"
          :multiple="true"
          :text-attribute="null"
          :value-attribute="null"
          variant="red"
          placeholder="exclude..."
          @update="(e) => excludedVariants = e"
        />
      </template>

      <gButton
        type="submit"
        class="w-full bg-green-500 text-green-900 py-4 mt-6"
        :disabled="Object.keys(errors).length > 0"
        @click="createProduct()">
        <template v-if="formState !== 'saving'">Create Product</template>
        <Loading v-else classes="bg-green-900" />
      </gButton>
    
      <pre>
        <code>{{ JSON.stringify(excludedVariants, null, 4) }}</code>
      </pre>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { handleize, capitalize } from '~/utils/funcs'

export default {
  async asyncData({ $algolia }) {
    const productIndex = $algolia.initIndex('products_live');
    const productTypes = await productIndex.searchForFacetValues('product_type', '', {maxFacetHits: 100})
      .then(res => res.facetHits.map(hit => hit.value))
      .catch(console.error)
    return {productIndex, productTypes}
  },
  data() {
    return {
      formState: 'ready' /* ready, fetching, saving, saved */,
      errors: {},
      touched: [],
      expandedIndex: 0,
      fields: {
        title: {
          type: 'text',
          handler: (val) => {
            this.product = { ...this.product, handle: handleize(val) }
          }
        },
        handle: {
          type: 'text',
          handler: (val) => {
            this.product = { ...this.product, handle: handleize(val) }
          }
        },
        body_html: {
          type: 'richtext'
        },
        price: {
          type: 'text'
        }
      }
    }
  },
  computed: {
    product: {
      get() {
        return this.$store?.state?.productCreate?.product || null
      },
      set(value) {
        console.log({value})
        this.setProduct({value})
      }
    },
    tags: {
      get() {
        return this.$store?.product?.tags?.split(', ') || ''
      },
      set(val) {
        const value = val?.join ? val.join(', ') : val
        this.setOnProduct({key: 'tags', value })
      }
    },
    variantTitles() {
      return this.product?.variants?.map(v => v.title) || []
    },
    excludedVariants: {
      get() {
        return this.$store?.excludedVariants || []
      },
      set(val) {
        console.log({ val })
        this.$store.dispatch('productCreate/setExcludedVariants', val)
      }
    },
    touchedErrors() {
      return Object.keys(this.errors).filter(key => this.touched.includes(key))
        .reduce((acc, key) => {
          return { ...acc, [key]: this.errors[key] }
        }, {})
    }
  },
  watch: {
    product() {
      if(this.formState === 'fetching') {
        this.formState = 'ready'
      }
    }
  },
  mounted() {
    this.$store.dispatch('productCreate/getUniqueSkus').catch(console.error)
    console.log('productIndex: ', this.productIndex)
  },
  unmounted() {
    this.resetState()
  },
  methods: {
    capitalize,
    ...mapMutations({
      setProduct: 'productCreate/setProduct',
      setOnProduct: 'productCreate/setOnProduct',
      resetState: 'productCreate/resetState',
    }),
    ...mapActions({
      setVariants: 'productCreate/setVariants',
      copyFrom: 'productCreate/copyFrom',
    }),
    copyReferenceProduct() {
      this.formState = 'fetching'
      this.copyFrom();
    },
    fetchProductTypeOptions(e) {
      const res = this.index.searchForFacetValues('product_type', e, { maxFacetHits: 100 })
          .then(res => res.facetHits)
          .then(results => { return {results: results.map(item => item.value)} });
      console.log({res})
      return res
    },
    checkForErrors() {
      this.errors = {};
      if(this.product.variants.length > 100) {
        this.errors.variants = `only 100 variants allowed ( current count: ${this.product.variants.length} )`
      }
      const cantBeNull = ['title', 'handle', 'weight', 'price', 'product_type'];
      cantBeNull.filter(key => ['', undefined, null].includes(this.product[key]))
        .forEach(key => {
          this.errors[key] = `attribute "${key}" cannot be undefined`
        })
    },
    createProduct() {
      this.checkForErrors();
      if(!this.errors?.length) {
        this.formState = 'saving'
        this.$store.dispatch('productCreate/create')
          .then(res => {
            console.log(res);
            this.formState = 'saved';
          })
      }
    },
    addOption() {
      if (this.product.options.length >= 3) { return }
      const options = !Array.isArray(this.product.options) ? [] : JSON.parse(JSON.stringify(this.product.options))
      options.push({ name: '', values: [] })
      this.product = { ...this.product, options }
      setTimeout(() => {
        this.expandedIndex = options.length - 1
        this.setVariants()
      }, 100)
      setTimeout(() => {
        const nextInput = this.$refs.productOptions.querySelector(`#product-option${options.length}-name`)
        nextInput.focus()
        console.log(`productOption${options.length}`, this.$refs)
        this.scrollTo(`productOption`, options.length - 1)
      }, 250)
    },
    updateField(key, val) {
      this.product = {...this.product, [key]: val}
      if (this.fields[key]?.handler) {
        this.fields[key].handler(val)
      }
      if (['options', 'price', 'weight', 'weight_unit', 'product_type'].includes(key)) {
        setTimeout(() => {
          this.checkForErrors();
          this.setVariants();
        }, 100)
      }
    },
    addOptionValue(optionIndex) {
      const options = JSON.parse(JSON.stringify(this.product.options))
      options[optionIndex].values.push('');
      this.updateField('options', options)
      setTimeout(() => {
          this.$refs.productOptions.querySelector(`.form-field.option${optionIndex + 1} .option-values`).querySelector('.option-value:nth-last-child(1) input').focus()
      }, 100)
    },
    log(val) {
      console.log(val)
    },
    scrollTo(refName, index = 0, offset = 0) {
      const ref = Array.isArray(this.$refs[refName]) ? this.$refs[refName][index] : this.$refs[refName];
      let element = ref?._vnode?.elm || ref;
      if (refName === 'productOption') {
        element = element.offsetParent
      }
      console.log({ ref, element })
      const top = element.offsetTop + offset;
      window.scrollTo({top, left: 0, behavior: 'smooth'});
    }
  }
}
</script>

<style lang="scss">
label {
  @apply mt-4 block text-sm text-gray-500 mb-1;
}
input {
  &:focus {
    @apply border-transparent #{!important};
  }
}
.form-field {
  @apply mb-2 flex items-start;
  label {
    @apply mt-2;
    min-width: 130px;
    + * {
      width: 100%;
    }
  }
  &:hover:not(.metafields) {
    > label {
      @apply text-purple-400 text-opacity-100;
    }
  }
  &.product_type {
    .inline-block > button {
      @apply bg-gray-200 dark:bg-gray-800 #{!important};
    }
  }
  &.metafields {
    @apply border-2 border-gray-300 dark:border-gray-800 rounded-md p-4 my-4 flex-col;
	}
	&.body_html {
		@apply flex-col;
    label {
      @apply w-full ml-0;
    }
	}
}
.form-field-group {
	&.options {
		.form-field {
			flex-direction: column;	
		}
	}
}
.option-values {
  &:not(:hover) {
    .add-option-value {
      @apply hidden;
    }
  }
  
}
.option-value {
  &:not(:hover) {
    .remove-option-value{
      @apply hidden;
    }
  }
}
</style>