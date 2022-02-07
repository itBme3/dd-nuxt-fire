
<template>
  <ais-instant-search-ssr>
    <ais-search-box />
    <ais-stats />
    <ais-refinement-list attribute="material" />
    <ais-hits>
      <template #item="{ item }">
        <p>
          <ais-highlight attribute="title" :hit="item" />
        </p>
        <p>
          <ais-highlight attribute="price" :hit="item" />
        </p>
      </template>
    </ais-hits>
    <ais-pagination />
  </ais-instant-search-ssr>
</template>

<script>
/* eslint-disable vue/order-in-components */
import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisStats,
  AisPagination,
  createServerRootMixin,
} from 'vue-instantsearch';
import algoliasearch from 'algoliasearch/lite';
import _renderToString from 'vue-server-renderer/basic';

function renderToString(app) {
  return new Promise((resolve, reject) => {
    _renderToString(app, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

const searchClient = algoliasearch(
  '010RMUCHO8',
  '9610abb7baa7ae39ae7bc28dc246aaa7'
);

export default {
  mixins: [
    createServerRootMixin({
      searchClient,
      indexName: 'products_live',
    }),
  ],
  serverPrefetch() {
    return this.instantsearch
      .findResultsState({
        component: this,
        renderToString,
      }).then(algoliaState => {
        this.$ssrContext.nuxt.algoliaState = algoliaState;
      });
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/instantsearch.css@7.4.5/themes/satellite-min.css',
        },
      ],
    };
  },
  beforeMount() {
    const results =
      (this.$nuxt.context && this.$nuxt.context.nuxtState.algoliaState) ||
      window.__NUXT__.algoliaState;

    this.instantsearch.hydrate(results);

    // Remove the SSR state so it can't be applied again by mistake
    delete this.$nuxt.context.nuxtState.algoliaState;
    delete window.__NUXT__.algoliaState;
  },
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisStats,
    AisPagination,
  },
};
</script>