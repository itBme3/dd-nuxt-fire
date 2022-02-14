<template>
  <div 
    :class="{'algolia-search': true, [indexName]: typeof indexName === 'string' }">
    <div class="search-bar">
      <input
        v-model="search"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full bg-transparent border-none shadow-none"
        placeholder="search..."
        type="search"
        autocomplete="on"
      />
      <span v-if="hitCount > 0" class="hit-count">{{ hitCount }}</span>
      <Btn class="center bg-transparent icon-button ml-1"
        @click="!!search && search.length > 0 ? search = '' : ''">
        <Icon :name="!!search && search.length > 0 ? 'close' : 'search'" />
      </Btn>
    </div>
    <div v-if="!!hits && !!hits.length"
      :id="indexName + 'AlgoliaMason'"
      class="hits">
      <div v-for="hit in hits" :key="hit.id"
        class="hit">
        <CardProduct v-if="indexName.includes('product')"
          :class="{
            [cardClasses]: typeof cardClasses === 'string' && cardClasses.length > 0,
            ['card-style-' + cardStyle]: true
          }"
          :item="hit" />
        <CardReview v-else-if="indexName.includes('review')"
          :class="{
            [cardClasses]: typeof cardClasses === 'string' && cardClasses.length > 0,
            ['card-style-' + cardStyle]: true
          }"
          :item="hit" />
        <Card v-else
          :class="{
            'p-0': true,
            [cardClasses]: typeof cardClasses === 'string' && cardClasses.length > 0,
            ['card-style-' + cardStyle]: true
          }">
          <template #media
            v-if="!!hit.downloadUrl || !!hit.image || !!hit.image">
            <Media :media="!!hit.downloadUrl ? hit : !!hit.image ? hit.image : hit.media" />
          </template>
        </Card>
      </div>
    </div>
    <div v-else-if="hits === null">loading...</div>
    <div v-else>no results found...</div>

    <template v-if="nextPage !== false && fetchingHits === false">
      <div v-view="infiniteScrollHandler">
        <Btn class="text-xs border-1 border-gray-400 border-opacity-20 bg-transparent" @click="getNextPage" >Get Next Page</Btn>
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
      type: Array, /* AlgoliaFilterObject[] */
      default: () => []
    }, 
    cardClasses: {
      type: String,
      default: () => ''
    }, 
    cardStyle: {
      type: String, /* 'media-above' | 'media-left' | 'media-left' */
      default: 'media-above'
    }
  },
  data() {
    return {
      algoliaIndex: null,
      search: this.$route?.query?.s ? this.$route.query.s : '',
      filters: this.$route?.query?.filters ? qs.parse(this.$route?.query?.filters) : [],
      hits: null,
      hitCount: 0,
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
    },
    masonId() {
      return this.indexName + 'AlgoliaMason' 
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
          this.hitCount = res.nbHits
          setTimeout(() => {
            this.fetchingHits = false
            // this.$redrawVueMasonry(this.masonId)
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
.search-bar {
  @apply sticky top-[2.98rem] shadow-lg z-999 rounded bg-white focus-within:bg-gray-200 dark:bg-gray-900 shadow-xl focus-within:shadow-sm dark:focus-within:bg-gray-800 p-2 flex items-center justify-start border border-gray-200 dark:border-gray-800;
}
.hit-count {
  padding: .13em .25em .13em .2em;
  @apply bg-cyan-300 text-black text-opacity-60 text-xs rounded-sm block;
}
.hits {
  @apply grid grid-cols-12;
}
.hit {
  @apply col-span-12 sm:col-span-6 md:col-span-4 p-1;
}
.algolia-search.media {
  .hit {
    @apply m-auto;
  }
}
/*
hover:bg-purple-500
hover:bg-blue-500
hover:bg-cyan-500
hover:bg-green-500
hover:bg-yellow-500
*/
</style>