<template>
  <div v-if="Array.isArray(filterOptions) && filterOptions.length > 0"
    class="filter-options flex flex-col content-start">
    <gButton
      class="mt-3 mb-1"
      @click="selectingOptions = !selectingOptions">{{ buttonText }}</gButton>
    <div v-if="selectingOptions"
      class="options-select flex flex-col space-y-1">
      <gButton 
        v-for="(option, i) in filterOptions"
        :key="i"
        class="w-full"
        @click="addFilter(option)">
        {{ option }}
      </gButton>
    </div>
  </div>
</template>

<script>
import { filterOptions, filterOptionsByIndex } from '~/utils/algolia'

export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    buttonText: {
      type: String,
      default: 'Filters'
    },
    indexName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectingOptions: false,
    }
  },
  computed: {
    filterOptions() {
      const indexName = this.indexName.includes('product') ? 'products' : this.indexName;
      return this.options.length > 0 
        ? this.options 
        : Object.keys(filterOptionsByIndex).includes(indexName) 
          ? filterOptionsByIndex[indexName] 
          : null
    }
  },
  methods: {
    addFilter(key) {
      this.$emit('change', filterOptions[key]); 
      this.selectingOptions = false
    }
  }
}
</script>