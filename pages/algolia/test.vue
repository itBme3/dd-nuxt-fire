<template>
    <AlgoliaQuickSelect 
      :show="true"
      :classes="classes"
      :card-style="cardStyle"
      :index-name="indexName"
      :constant-filters="constantFilters"
      :selection-values="selection"
      :search-query="searchQuery"
      :selecting="selecting"
      @selection="(e) => {
        log(e)
        selection = e
      }"
      @submit="(e) => {
        log('submitting'); log(e)
        selection = e
      }"
    />
</template>

<script>
export default {
  data() {
    return {
      selection: [],
      indexName: 'products_dev',
      searchQuery: 'Slim Fit',
      classes: {
        card: 'p-0',
        hit: 'col-span-full'
      },
      cardStyle: 'media-left',
      constantFilters: [
        {
          attribute: 'fit',
          value: 'Relaxed Fit',
          type: 'refinement_list',
          not: false,
          or: null
        }
      ],
      // fetchNextPage
      selecting: {
        // quick: true,
        identifier: 'handle',
        multiple: true
      }
    }
  },
  methods: {
    log(e) {
      console.log(e)
    }
  }
}
</script>