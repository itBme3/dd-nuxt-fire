<template>
  <div 
    :class="{
      'algolia-search': true, [indexName]: typeof indexName === 'string',
      'selecting': selectingOptions,
      'is-selecting': !!selectingOptions,
      'hide-selected': !!selectingOptions && !!selectingOptions.hideSelected
    }">
    <AlgoliaSearchFilters 
      v-if="filtering"
      :constant-filters="constantFilters"
      :update-url="updateUrl"
      :search="search"
      :index-name="indexName"
      :index="index"
      :filters="filters"
      @change="updateFilters"
    />
    <div class="search-header">
      <div class="search-header-inner">
        <slot name="headerStart" />
        <div v-if="searchBar"
          class="search-bar">
          <input
            ref="searchInput"
            v-model="search"
            class="appearance-none border rounded py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline w-full bg-transparent border-none shadow-none"
            placeholder="search..."
            type="search"
            autocomplete="on"
            @focus="searchInputFocused = true"
            @blur="searchInputFocused = false"
          />
          <span v-if="hitCount > 0" class="hit-count">{{ hitCount }}</span>
          <Btn class="center bg-transparent icon-button ml-1"
            @click="!!search && search.length > 0 ? search = '' : ''">
            <Icon :name="!!search && search.length > 0 ? 'close' : 'search'" />
          </Btn>
        </div>
        <slot name="headerEnd" />
      </div>
      <div class="search-header-after">
        <slot name="headerAfter" />
      </div>
    </div>
    <div v-if="!!hits && !!hits.length"
      class="hits"
      :class="{ 
        [classes && classes.grid ? classes.grid : '']: true,
        'hidden': !searchInputFocused && !hitsHovered && selected && selected.length && !!selectingOptions && !!selectingOptions.quick,
        'fade-in-down': (searchInputFocused || hitsHovered) && !!selectingOptions && !!selectingOptions.quick
      }"
      @mouseenter="hitsHovered = true"
      @mouseleave="hitsHovered = false"
      >
      <div v-for="(hit, i) in hits" :key="hit.id"
        :class="{
          'hit cursor-pointer': true,
          'selected': selected.map(s => s[selectingOptions.identifier]).includes(hit[selectingOptions.identifier]),
          [classes && classes.hit ? classes.hit : '']: true
        }"
        @click="hitClicked(i)">
        
        <CardProduct 
          v-if="indexName.includes('product')"
          :card-style="cardStyle"
          :classes="classes"
          :item="hit"
          :more="cardProps && cardProps.more ? cardProps.more : []"
        />
        <CardReview 
          v-else-if="indexName.includes('review')"
          :card-style="cardStyle"
          :classes="classes"
          :class="{
            [classes && classes.card ? classes.card : '']: true,
          }"
          :item="hit" />
        <CardMedia v-else-if="indexName === 'media'"
          :class="{
            'p-0': true,
            [classes && classes.card ? classes.card : '']: true,
            ['card-style-' + cardStyle]: true
          }"
          :item="hit"
        />
      </div>
    </div>
    <div v-else-if="hits === null">loading...</div>
    <div v-else>no results found...</div>

    <template v-if="nextPage !== false && fetchingHits === false && (searchInputFocused || !selectingOptions || !selectingOptions.quick)">
      <div v-view="infiniteScrollHandler">
        <Btn class="text-xs border-1 border-gray-400 border-opacity-20 bg-transparent" @click="getNextPage" >Get Next Page</Btn>
      </div>
    </template>
  </div>
</template>

<script>

import Vue from 'vue';
import {debounce} from 'lodash'
import { parseUrlParamFilters, stringifyAlgoliaFilters, stringifyUrlParamFilters } from '~/utils/algolia'
const defaultSelectingOptions = { 
    selected: [],
    identifier: 'id',
    hideSelected: false,
    hideSideNav: false,
    multiple: true
} 
export default Vue.extend({
  props: {
    indexName: {
      type: String,
      default: null
    },
    updateUrl: {
      type: Boolean,
      default: true
    },
    filtering: {
      type: Boolean,
      default: true
    },
    searchQuery: {
      type: String,
      default: ''
    },
    searchBar: {
      type: Boolean,
      default: true
    },
    constantFilters: {
      type: Array, /* AlgoliaFilterObject[] */
      default: () => []
    }, 
    classes: {
      type: Object,
      default: () => {
        return {
          grid: '',
          hit: '',
          card: '',
          title: '',
          content: '',
          media: '',
        }
      }
    },
    cardStyle: {
      type: String, /* 'media-above' | 'media-left' | 'media-left' */
      default: 'media-above'
    },
    filterValues: {
      type: Object,
      default: () => { return {} }
    },
    selectedValues: {
      type: Array,
      default: () => []
    },
    fetchNextPage: {
      type: Boolean,
      default: false
    },
    selecting: {
      type: [Object, Boolean],
      default: () => true
      /*
      true defaults to:
          { 
            identifier: 'id',
            hideSelected: false,
            hideSideNav: false, 
            quick: false
          } 
        */
    },
    cardProps: {
      type: Object,
      default: () => {
        return { more: [] }
      }
    }
  },
  data() {
    const queryFilterKeys = Object.keys(this.$route?.query)
        .filter(k => k.indexOf('filters') === 0)
    const filters = this.updateUrl && queryFilterKeys?.length
      ? parseUrlParamFilters(queryFilterKeys.map(k => `${k}=${this.$route.query[k]}`).join('&')
      ).filters
        : Array.isArray(this.filterValues.filters) 
          ? this.filterValues.filters
          : [];
    return {
      algoliaIndex: null,
      search: this.updateUrl ? this.$route?.query?.s ? this.$route.query.s : '' : this.searchQuery,
      filters: Array.isArray(filters) ? filters : [],
      hits: null,
      hitCount: 0,
      nextPage: false,
      fetchingHits: true,
      selected: Array.isArray(this.selectedValues) ? this.selectedValues : [],
      searchInputFocused: false,
      selectingOptions: [null, undefined, true].includes(this.selecting) 
        ? defaultSelectingOptions
        : this.selecting,
        hitsHovered: false
    }
  },
  computed: {
    index() {
      if (this.algoliaIndex !== null) return this.algoliaIndex
      if (!this.indexName?.length) return null;
      const index = this.$algolia.initIndex(this.indexName)
      return index;
    }
  },
  watch: {
    search: debounce(function (value) {
        this.updateSearch(value)
    }, 250),
    filterValues(val) {
      this.filters = val
    },
    selectedValues(val) {
      this.selected = val
    },
    fetchNextPage() {
      if(this.fetchNextPage === false || this.nextPage === false) {return};
      this.getNextPage();
    },
    selecting(val) {
      try {
        this.selectingOptions = {...defaultSelectingOptions, ...val}
      } catch {
        this.selectingOptions = val
      }
    }
  },
  
  mounted() {
    this.getHits();

    window.addEventListener('keyup', this.handleEsc)
  },
  unmounted() {
    window.removeEventListener('keyup', this.handleEsc)
  },
  methods: {
    handleEsc(e) {
      if(e.key === 'Escape') {
        if(this.searchInputFocused || this.hitsHovered ) {
          this.$refs.searchInput.blur()
          this.searchInputFocused = false;
          this.hitsHovered = false
         }
      }
    },
    updateSearch(val) {
      if(this.updateUrl && window !== undefined) {
        let query = stringifyUrlParamFilters(this.filters)
        try {
          if (val?.length) {
            query = `s=${val}&${query}`
          }
        } catch(err) {
          alert(err.message)
        }
        const path = !query?.length ? this.$route.path : `${this.$route.path}?${query}`
        window.history.pushState({path}, '', path)
      }
      this.getHits()
    },
    updateFilters(vals) {
      this.filters = Array.isArray(vals) ? vals : [];
      if(this.updateUrl && window !== undefined) {
        const s = this.$route.query.s;
        let query = this.$route.query;
        if (!this.filters?.length) {
          Object.keys(this.$route.query).forEach(k => {
            if(k.indexOf('filters') === 0) delete this.$route.query[k]
          })
        } else {
          query = stringifyUrlParamFilters(vals)
        }
        if(s?.length) query = `s=${s}&${query}`;
        const path = `${this.$route.path}${query?.length ? `?${query}`: '' }${this.$route?.hash?.length ? this.$route.hash : ''}`
        window.history.pushState({path}, '', path)
      }
      this.getHits();
    },
    getHits(page = 0) {
      this.fetchingHits = true;
      const search = typeof this.search === 'string' ? this.search : ''
      const constantFilters = Array.isArray(this.constantFilters) ? this.constantFilters : []
      const filterArr = Array.isArray(this.filters) ? this.filters : []
      const filters = stringifyAlgoliaFilters([...constantFilters, ...filterArr])
      if(page === 0) {
        this.hits = null
      }
      return this.index.search(search, { filters, page })
        .then(res => {
          this.nextPage = res?.hits?.length > 0 && res.page < res.nbPages - 1 ? res.page + 1 : false
          this.lastResponse = res;
          this.hits = page = 0 || !Array.isArray(this.hits) ? res.hits : [...this.hits, ...res.hits]
          this.hitCount = res.nbHits
          setTimeout(() => {
            this.fetchingHits = false
          }, 250);
          if(this.indexName.includes('products')) {
            this.$store.commit('productsCache/set', { products: this.hits, env: this.indexName.split('_')[1] })
          }
          return this.hits
        })
        .catch(err => {
          this.nextPage = false;
          alert(err.message)
        })
    },
    getNextPage() {
      if (this.nextPage === false) return false;
      this.getHits(this.nextPage);
    },
    infiniteScrollHandler (e) {
      if (e.percentInView > 0.20) {
        this.getNextPage()
      }
    },
    scrollHandler({ event, eventName }) {
      return { event, eventName }
    },
    hitClicked(index) {
      const item = this.hits[index];
      const focusAfterSelect = !!this.selectingOptions?.quick
      if (focusAfterSelect) {
        this.$refs.searchInput.focus()
      }
      const slug = this.indexName.includes('product') ? item.handle : item?.objectID || item.id
      if(!this.selectingOptions) {
        if (['media', 'reviews'].includes(this.indexName)) {
          return;
        }
        return this.$router.push({ path: `${this.$route.path}/${slug}${this.$route.hash}` })
      } else {
        const { identifier } = this.selectingOptions;
        if(this.selected.map(itm => itm[identifier]).includes(item[identifier])) {
          this.selected = this.selected.filter(s => s[identifier] !== item[identifier])
        } else {
          this.selected.push(item)
        }
      }
      this.$emit('selection', this.selected)
    }
  }
})
</script>

<style lang="scss">

.search-header {
  @apply sticky z-9999 top-12 flex flex-col content-start items-stretch bg-gray-100 dark:bg-gray-900;
  .search-header-inner {
    @apply flex items-center justify-start;
    .search-bar {
      @apply  w-full rounded bg-white focus-within:bg-gray-200 dark:bg-gray-900 shadow-xl focus-within:shadow-sm dark:focus-within:bg-gray-800 p-2 flex items-center justify-start border border-gray-200 dark:border-gray-800;
    }
  }
  .search-header-after {
    @apply w-full;
  }
  
}
.hit-count {
  padding: .13em .25em .13em .2em;
  @apply bg-cyan-300 text-black text-opacity-60 text-xs rounded-sm block;
}
.hits {
  @apply grid grid-cols-12 pt-6;
  em {
    @apply bg-cyan-400 text-black text-opacity-95 rounded-sm px-1
  }
}
.hit {
  @apply col-span-12 sm:col-span-6 md:col-span-4 p-0;
  .card {
    @apply border-2 border-transparent;
  }
}
.algolia-search {
  &.media {
    .hit {
      @apply m-auto;
    }
  }
  &.reviews {
    .hits {
      @apply space-y-6
    }
    .hit {
      @apply col-span-12;
      .card {
        @apply shadow-xl px-4 py-8 rounded-lg bg-white dark:bg-gray-800 dark:bg-opacity-40 mx-auto max-w-prose w-full;
      }
    }
  }
  &.is-selecting {
    .selected {
      .card {
        @apply border-purple-500;
        box-shadow: 0 0 3px 1px rgb(93 166 255);
      }
    }
    &.hide-selected {
      .selected {
        @apply hidden;
      }
    }
  }
}
</style>