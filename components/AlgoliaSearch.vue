<template>
  <div :class="{'algolia-search': true, [indexName]: typeof indexName === 'string' }">
    <div class="search-bar sticky top-12 rounded bg-white focus-within:bg-gray-200 dark:bg-gray-800 dark:shadow-lg dark:focus-within:shadow-none focus-within:shadow-none dark:focus-within:bg-opacity-20 dark:focus-within:bg-black p-2 flex items-center justify-start">
      <input
        v-model="search"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full bg-transparent border-none shadow-none"
        placeholder="search..."
        type="search"
        autocomplete="on"
      />
      <Btn @click="!!search && search.length > 0 ? search = '' : ''"
          class="center bg-transparent">
        <Icon :name="!!search && search.length > 0 ? 'close' : 'search'" />
      </Btn>
    </div>
    <div v-if="!!hits && !!hits.length" class="hits">
      <div class="hit"
        v-for="hit in hits"
        :key="hit.id">
        {{ hit.downloadUrl }}
      </div>
    </div>
    <div v-else-if="hits === null">loading...</div>
    <div v-else>no results found...</div>

    <template v-if="nextPage !== false && fetchingHits === false">
      <div v-view="infiniteScrollHandler">
        <Btn @click="getNextPage">Get Next Page</Btn>
      </div>
    </template>
  </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import qs from 'qs';
import _ from 'lodash'
import { convertToAlgoliaFilterString } from '~/utils/algolia'

const searchClient = algoliasearch(
  '010RMUCHO8',
  '9610abb7baa7ae39ae7bc28dc246aaa7'
);

export default {
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
    searchBar: {
      type: Boolean,
      default: true
    },
    constantFilters: {
      type: Array, // AlgoliaFilterObject[]
      default: () => []
    }
  },
  data() {
    return {
      algoliaIndex: null,
      search: this.$route?.query?.s ? this.$route.query.s : '',
      filters: this.$route?.query?.filters ? qs.parse(this.$route?.query?.filters) : [],
      hits: null,
      hitCount: null,
      nextPage: false,
      fetchingHits: true
    }
  },
  computed: {
    index() {
      if (this.algoliaIndex !== null) return this.algoliaIndex
      if (!this.indexName?.length) return null;
      const index = searchClient.initIndex(this.indexName)
      return index;
    }
  },
  watch: {
    search: _.debounce(function (value) {
        this.updateSearch(value)
    }, 250)
  },
  mounted() {
    this.getHits();
  },
  methods: {
    updateSearch(val) {
      if(this.updateUrl && window !== undefined) {
        if (!val?.length) {
          delete this.$route.query.s
        } else {
          this.$route.query.s = val
        }
        const queryString = qs.stringify(this.$route.query);
        const path = !queryString?.length ? this.$route.path : `${this.$route.path}?${queryString}`
        window.history.pushState({path}, '', path)
      }
      this.getHits()
    },
    getHits(page = 0) {
      this.fetchingHits = true;
      const search = typeof this.search === 'string' ? this.search : ''
      const constantFilters = Array.isArray(this.constantFilters) ? this.constantFilters : []
      const filterArr = Array.isArray(this.filters) ? this.filters : []
      const filters = convertToAlgoliaFilterString([...constantFilters, ...filterArr])
      if(page === 0) {
        this.hits = null
      }
      return this.index.search(search, { filters, page })
        .then(res => {
          this.nextPage = res?.hits?.length > 0 && res.page < res.nbPages - 1 ? res.page + 1 : false
          this.lastResponse = res;
          this.hits = page = 0 || !Array.isArray(this.hits) ? res.hits : [...this.hits, ...res.hits]
          this.hitCount = res.ngHits
          setTimeout(() => {
            this.fetchingHits = false;
          }, 250);
          return this.hits
        })
        .catch(err => {
          this.nextPage = false;
          alert(err)
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
      console.log({ event, eventName })
    }
  }
}
</script>

<style lang="scss">

</style>