<template>
  <scrollbar
    v-if="!!filterOptions"
    class="algolia-search-filters"
    :class="{
      'collapsed': filtersCollapsed
    }">

    <AlgoliaSearchFilterOptionsSelect
      v-if="!filtersCollapsed && filterValues.length === 0"
      :index-name="indexName"
      class="relative z-99"
      @change="addFilter"
    />
    <div 
      v-else
      class="flex items-center relative z-99">
      <gButton
        class="w-full rounded border dark:border-gray-800 dark:bg-transparent mb-1 flex items-center"
        :class="{
          'icon-button h-12 w-12 content-center': filtersCollapsed,
          'content-between text-red-900 dark:text-red-400 dark:hover:text-red-900 bg-red-400 hover:bg-red-600 hover:dark:bg-red-400 hover:text-red-900 ': filterValues.length > 0
        }"
        @click="() => {
          if(filtersCollapsed) {
            filtersCollapsed = false
            return
          }
          filtersCollapsed = !filtersCollapsed;
          filterValues = [];
          $emit('change', []);
        }">
        <Icon 
          :class="{
            'ml-1 mr-auto': !filtersCollapsed && filterValues.length === 0,
            'mx-auto': filtersCollapsed,
          }" 
          :name="!filtersCollapsed && filterValues.length > 0 ? 'close' : 'settings'" 
        />
        <template v-if="!filtersCollapsed && isMobile">Filters</template>
      </gButton>
    </div>
    <div 
      v-if="!filtersCollapsed && Array.isArray(filterValues) && filterValues.length > 0"
      class="filter-values flex flex-col content-start relative z-99">
      <template v-for="(value, i) in filterValues">
        <div :key="'filter-value-' + i"
            class="filter-value parent"
          >
          <small
            v-if="i > 0"
            class="txt-xs block mb-2 text-purple-400"
            >and</small>
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
    </div>
    <div v-if="!filtersCollapsed"
      class="fixed inset-0 cursor-pointer z-9"
      @click="filtersCollapsed = true" />
  </scrollbar>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapGetters} from 'vuex'
import { AlgoliaFilterObject } from '~/models/algolia.model';
import { filterOptionsByIndex } from '~/utils/algolia'

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
    updateUrl: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      default: ''
    },
    constantFilters: {
      type: Array as () => AlgoliaFilterObject[],
      default: () => []
    },
    filters: {
      type: Array as () => AlgoliaFilterObject[],
      default: () => []
    },
  },
  data(): {
    filterValues: AlgoliaFilterObject[]; 
    updatingValues:boolean;
    filtersCollapsed:boolean;
    } {
    const filterValues: AlgoliaFilterObject[] = Array.isArray(this.filters) ? this.filters : [];
    const updatingValues: boolean = false
    return {
      filterValues,
      updatingValues,
      filtersCollapsed: true
    }
  },
  computed: {
    ...mapGetters({
      isMobile: 'screen/isMobile'
    }),
    filterOptions():string[] | null {
      const indexName:string = this.indexName.includes('product') ? 'products' : this.indexName;
      return Object.keys(filterOptionsByIndex).includes(indexName) ? filterOptionsByIndex[indexName] : null
    }
  },
  watch: {
    filters(vals) {
      this.filterValues = vals
    },
    // isMobile(val) {
    //   this.filtersCollapsed = val
    // }
  },
  methods: {
    addFilter(filterVal:AlgoliaFilterObject) {
      this.filterValues.push(filterVal)
      console.log({ filterValues: this.filterValues })
      this.updatingValues = true;
      setTimeout(() => {
        this.updatingValues = false;
      }, 100)
    },
    updateFilter(indx:number, filter:AlgoliaFilterObject) {
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
    updateOrFilter(indx:number, orIndx:number, filter:AlgoliaFilterObject) {
      console.log('updateFilter: ', filter)
      this.updatingValues = true;
      if (!filter) {
        this.filterValues[indx].or?.splice(orIndx, 1)
      } else if(Array.isArray(this.filterValues[indx].or)) {
        const filterValueObj: AlgoliaFilterObject = this.filterValues[indx] || null;
        if(filterValueObj !== null && filterValueObj?.or && filterValueObj.or[orIndx]?.value) {
          filterValueObj.or[orIndx].value = filter.value
          filterValueObj.or[orIndx].not = !!filter.not
        }
      }
      this.$emit('change', this.filterValues)
      setTimeout(() => {
        this.updatingValues = false;
      }, 500)
    }
  }
})
</script>

<style lang="scss">
  :root {
    --algolia-filters-width: 200px;
  }
  .hits {
    @apply gap-3;
  }
  .algolia-search-filters {
    @apply sticky top-12 float-left z-999 left-0 overflow-y-scroll pr-4;
    height: calc(100vh - 120px);
    width: var(--algolia-filters-width);
    + .hits {
      width: calc(100% - var(--algolia-filters-width));
      margin-left: var(--algolia-filters-width);
    }
    &.collapsed {
      --algolia-filters-width: 3.5rem;
    }
  }
</style>