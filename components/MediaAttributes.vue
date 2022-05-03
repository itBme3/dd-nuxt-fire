<template>
  <div class="media-attributes">
    <gDropdown
      v-if="attributeKeys.filter(k => !adding.includes(k)).length"
      class="w-56">
        <div
          slot="trigger"
          slot-scope="{ mousedownHandler, focusHandler, blurHandler, keydownHandler }"
          class="dropdown-trigger"
          >
          <gButton
            id="select-attributes"
            class="flex items-center justify-between w-full"
            aria-label="Select attributes menu"
            aria-haspopup="true"
            @mousedown="mousedownHandler"
            @focus="focusHandler"
            @blur="blurHandler"
            @keydown="keydownHandler"
          >
            <span class="my-auto">Attributes</span> <Icon :name="'add'" class="ml-auto mr-0 my-auto" />
          </gButton>
        </div>
        <div slot-scope="{ hide }" class="dropdown-buttons">
          <gButton 
            v-for="key in attributeKeys.filter(k => !adding.includes(k))"
            :key="key"
            role="menuitem" @click="(e) => { 
              hide(e); adding.push(key)
            }">
            {{ key }}
          </gButton>
        </div>
    </gDropdown>
      <div
        v-for="(key, i) in adding"
        :key="'adding-' + key"
        class="w-full mt-3">
        <p :class="{
          ['text-' + getColor(i) + '-400']: true
        }">{{ key }}:</p>
        <RichSelect
          :close-on-select="false"
          :multiple="true"
          :variant="getColor(i)"
          :fetch-options="fetchOptions(key)"
          :can-create="key !== 'products'"
          :selected="JSON.parse(JSON.stringify(attributes[key].map(w => w.toLowerCase())))"
          :value-attribute="null"
          :text-attribute="null"
          :placeholder="'select ' + key + '...'"
          @update="(e) => {
            updateAttributes(key, e)
          }"
        />
      </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { blankAttributes, attributeKeys } from '~/models/media.model'
import { getColor } from '~/utils/colors'

export default Vue.extend({
  props: {
    current: {
      type: Object,
      default: () => blankAttributes
    }
  },
  data() {
    return {
      attributes: JSON.parse(JSON.stringify(blankAttributes)),
      index: this.$algolia.initIndex('media'),
      productsIndex: this.$algolia.initIndex('products_live'),
      attributeKeys,
      adding: attributeKeys.filter(key => Array.isArray(this.current[key]) && this.current[key].length > 0)
    }
  },
  created() {
    setTimeout(() => {
      attributeKeys.forEach(key => 
        Array.isArray(this.current[key]) && this.current[key].length 
          ? this.current[key].forEach(val => this.attributes[key].push(val))
          : ''
      )
    }, 250)
  },
  methods: {
    async updateAttributes(key, val) {
      try {
        if(
          key === 'products'
        ) {
          const newProducts = await Promise.all(val
            .map(handle => {
              return this.$db.doc(`products_live/${handle}`)
            })).then(res => res.filter(p => !!p.handle));
          const attributesFromProduct = ['material', 'style', 'color', 'fit', 'wash'];
          for(const product of newProducts) {
            attributesFromProduct.forEach(key => {
              const k = key === 'wash' ? 'color' : key;
              const mediaKey = `${k}s`
              if (!Array.isArray(this.attributes[mediaKey])) {
                this.attributes[mediaKey] = []
              }
              const current = Array.isArray(this.attributes[mediaKey]) ? this.attributes[mediaKey] : [];
              const onProduct = Array.isArray(product[k]) ? product[k] : [];
              const values = [...current, ...onProduct.filter(w => !current.includes(w))]
              if(values?.length && !this.adding.includes(mediaKey)) {
                this.adding.push(mediaKey);
              }
              setTimeout(() => {
                this.attributes[mediaKey] = values
              }, 500)
            })
          }
        }
        this.attributes[key] = val;
        this.$emit('update', this.attributes);
      } catch(err) {
        this.attributes[key] = val;
        this.$emit('update', this.attributes);
        console.error(err)
      }
    },
    fetchOptions(key) {
      return (e) => {
        return this.index.searchForFacetValues(key, e)
          .then(res => res.facetHits)
          .then(results => { return {results: results.map(item => item.value)} });
      }
    },
    getColor
  }
})
</script>

<style lang="scss">
  .dropdown-buttons {
    @apply flex flex-col space-y-2;
    .button {
      @apply w-full;
    }
  }
</style>