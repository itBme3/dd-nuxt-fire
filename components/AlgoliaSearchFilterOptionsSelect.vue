<template>
  <div v-if="Array.isArray(filterOptions) && filterOptions.length > 0"
    class="filter-options flex flex-col content-start">
    <gButton
      class="mt-3 mb-0 dark:bg-transparent border border-gray-200 dark:border-gray-800"
      :class="{
        'w-12 pt-0 pb-1 bg-cyan-400 text-cyan-900 hover:bg-cyan-300 hover:dark:bg-cyan-300 hover:dark:text-cyan-900 dark:text-cyan-300': buttonText === 'or',
        'bg-purple-400 text-purple-900 hover:bg-purple-300 hover:dark:bg-purple-300 hover:dark:text-purple-900 dark:text-purple-300': buttonText === 'and',
      }"
      @click="selectingOptions = !selectingOptions">{{ buttonText }}</gButton>
    <div v-if="selectingOptions"
      class="options-select flex flex-col space-y-1 mt-1">
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

<script lang="ts">
import Vue from 'vue'
import { filterOptions, filterOptionsByIndex } from '~/utils/algolia'
export default Vue.extend({
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
  data():{selectingOptions: boolean} {
    return {
      selectingOptions: this.buttonText === 'Filters',
    }
  },
  computed: {
    filterOptions() {
      const indexName = this.indexName.includes('product') ? 'products' : this.indexName;
      return this.options.length > 0 
        ? this.options 
        : Object.keys(filterOptionsByIndex).includes(indexName) 
          ? JSON.parse(JSON.stringify(filterOptionsByIndex[indexName])) 
          : null
    }
  },
  methods: {
    addFilter(key:string) {
      this.$emit('change', JSON.parse(JSON.stringify(filterOptions[key]))); 
      this.selectingOptions = false
    }
  }
})
</script>