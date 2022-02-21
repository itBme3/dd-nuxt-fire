<template>
  <scrollbar
    v-if="!!filterOptions"
    class="algolia-search-filters overflow-y-scroll px-2 pt-2">
    <AlgoliaSearchFilterOptionsSelect
      v-if="filterValues.length === 0"
      :index-name="indexName"
      @change="addFilter"
    />
    <gButton
      v-else
      class="w-full rounded bg-white bg-opacity-5 hover:bg-opacity-100 hover:bg-red-400 hover:text-red-900 mb-1"
      @click="filterValues = []; $emit('change', [])">
      Clear Filters
    </gButton>
    <div 
      v-if="Array.isArray(filterValues) && filterValues.length > 0"
      class="filter-values flex flex-col content-start">
      <template v-for="(value, i) in filterValues">
        <div :key="'filter-value-' + i"
            class="filter-value parent"
          >
          <AlgoliaSearchFilterValue
            v-if="!updatingValues"
            :value="value"
            :index-name="indexName"
            :index-filters="filters"
            :index="index"
            @change="(e) => updateFilter(i, e)">

            <template v-if="!updatingValues && Array.isArray(value.or) && value.or.length > 0">
              <AlgoliaSearchFilterValue
                v-for="(orValue, ii) in value.or"
                :key="'or-filter-' + ii"
                :value="orValue"
                :index-name="indexName"
                :index-filters="filters"
                :index="index"
                :is-or="true"
                @change="(e) => updateOrFilter(i, ii, e)" />
            </template>

          </AlgoliaSearchFilterValue>

          <AlgoliaSearchFilterOptionsSelect
            v-if="!updatingValues && i === filterValues.length - 1"
            :index-name="indexName"
            :button-text="'and'"
            @change="addFilter"
          />
        </div>
      </template>
      <Codeblock v-if="!updatingValues">{{ JSON.stringify(filterValues, null, 2) }}</Codeblock>
    </div>
  </scrollbar>
</template>

<script>
import { filterOptionsByIndex } from '~/utils/algolia'

export default {
  props: {
    indexName: {
      type: String,
      default: null
    },
    index: {
      type: Object,
      default: () => null
    },
    updateUrl: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      default: ''
    },
    constantFilters: {
      type: Array, /* AlgoliaFilterObject[] */
      default: () => []
    },
    filters: {
      type: Array, /* AlgoliaFilterObject[] */
      default: () => []
    },
  },
  data() {
    return {
      filterValues: this.filters,
      updatingValues: false
    }
  },
  computed: {
    filterOptions() {
      const indexName = this.indexName.includes('product') ? 'products' : this.indexName;
      return Object.keys(filterOptionsByIndex).includes(indexName) ? filterOptionsByIndex[indexName] : null
    }
  },
  watch: {
    filters(vals) {
      this.filterValues = vals
    }
  },
  methods: {
    addFilter(filterVal) {
      this.filterValues.push(filterVal)
      console.log({ filterValues: this.filterValues })
      this.updatingValues = true;
      setTimeout(() => {
        this.updatingValues = false;
      }, 100)
    },
    updateFilter(indx, filter) {
      console.log('updateFilter: ', filter)
      this.updatingValues = true;
      if (!filter) {
        this.filterValues.splice(indx, 1)
      } else {
        this.filterValues[indx].value = filter.value
        this.filterValues[indx].or = filter.or
        this.filterValues[indx].not = !!filter.not
      }
      this.$emit('change', this.filterValues);
      setTimeout(() => {
        this.updatingValues = false;
      }, 100)
    },
    updateOrFilter(indx, orIndx, filter) {
      console.log('updateFilter: ', filter)
      this.updatingValues = true;
      if (!filter) {
        this.filterValues[indx].or.splice(orIndx, 1)
      } else {
        this.filterValues[indx].or[orIndx].value = filter.value
        this.filterValues[indx].or[orIndx].not = !!filter.not
      }
      this.$emit('change', this.filterValues)
      setTimeout(() => {
        this.updatingValues = false;
      }, 500)
    }
  }
}
</script>

<style lang="scss">
  :root {
    --algolia-filters-width: 200px;
  }
  .algolia-search-filters {
    @apply sticky float-left z-999 left-0;
    top: 100px;
    height: calc(100vh - 120px);
    width: var(--algolia-filters-width);
    + .hits {
      width: calc(100% - var(--algolia-filters-width));
      margin-left: var(--algolia-filters-width);
    }
  }
</style>