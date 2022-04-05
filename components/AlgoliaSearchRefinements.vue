<template>
  <div class="algolia-search-refinements">
    <div class="search-field mb-1 pr-2 flex items-center content-start rounded bg-white dark:bg-gray-800 bg-opacity-50 shadow-lg focus-within:shadow-sm focus-within:bg-opacity-100">
      <gInput
        ref="searchInput"
        v-model="search"
        class="mx-0 w-full"
        type="text" 
      />
      <Icon :name="'search'"
        position="absolute right-4 top-1/2 -translateY-1/2"
        @click="() => $refs.searchInput.focus()" />
    </div>
    <div v-if="hits.length"
      class="refinement-hits flex flex-col space-y-1">
      <gButton v-for="hit in hits"
        :key="hit.value"
        class="refinement-hit font-normal text-xs relative px-2 flex w-full content-start items start"
        @click="$emit('change', hit.value)">
        <!-- <Icon class="my-auto ml-0 mr-2" :name="'box'" /> -->
        <scrollbar class="my-auto overflow-x-scroll ml-0">{{ hit.value }}</scrollbar>
        <small class="my-auto rounded text-xs bg-black bg-opacity-5 text-blue-500 transform scale-90 ml-auto mr-0">{{ hit.count }}</small>
      </gButton>
    </div>
    <code v-else>no hits...</code>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import { AlgoliaFilterObject } from '~/models/algolia.model';
import {stringifyAlgoliaFilters} from '~/utils/algolia';
const {debounce} = require('lodash');

export default Vue.extend({
  props: {
    indexName: {
      type: String,
      default: null
    },
    index: {
      type: Object,
      default: () => null
    },
    attribute: {
      type: String,
      default: null
    }
  },
  data(): { hits: {[key:string]: any}[]; search:string; } {
    return {
      hits: [],
      // activeFilters: this.indexFilters,
      // algoliaFilters: null,
      search: ''
    }
  },
  watch: {
    search: debounce(function(){
      this.getHits();
    }, 250)
  },
  mounted() {
    this.getHits().catch(console.error)
    setTimeout(() => {
      this.$refs.searchInput.focus()
    }, 250)
  },
  methods: {
    stringifyAlgoliaFilters,
    async getHits() {
      this.hits = await this.index.searchForFacetValues(this.attribute, this.search).then((res:any) => res.facetHits);
      console.log('hit: ', this.hits);
      return this.hits
    }
  }
})
</script>