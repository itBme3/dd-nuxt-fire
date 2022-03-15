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
          :can-create="true"
          :selected="attributes[key]"
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
import { blankAttributes, attributeKeys } from '~/models/media.model'
import { getColor } from '~/utils/colors'

export default {
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
    updateAttributes(key, val) {
      console.log({ key, val });
      this.attributes[key] = val;
      this.$emit('update', this.attributes)
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
}
</script>

<style lang="scss">
  .dropdown-buttons {
    @apply flex flex-col space-y-2;
    .button {
      @apply w-full;
    }
  }
</style>