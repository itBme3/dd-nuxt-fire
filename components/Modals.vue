<template>
  <div class="models">
    
    <ShopifyProductSave v-if="isProductPage"/>

    <template v-for="algoliaIndex in ['reviews', 'media', 'products_live', 'products_dev']">
      <LazyAlgoliaModalSelect
          v-if="algoliaIndex === $store.state.algoliaSelect.props.indexName"
          :key="algoliaIndex"
          :show="algoliaIndex === $store.state.algoliaSelect.props.indexName"
          :index-name="$store.state.algoliaSelect.props.indexName"
          :filter-values="$store.state.algoliaSelect.props.filterValues"
          :constant-values="$store.state.algoliaSelect.props.constantFilters"
          :selecting="{
            identifier: typeof $store.state.algoliaSelect.props.selecting.identifier === 'string' ? $store.state.algoliaSelect.props.selecting.identifier : `objectID`,
            hideSideNav: !!$store.state.algoliaSelect.props.selecting && !!$store.state.algoliaSelect.props.selecting.hideSideNav,
            hideSelected: !!$store.state.algoliaSelect.props.selecting && !!$store.state.algoliaSelect.props.selecting.hideSelected,
            multiple: !!$store.state.algoliaSelect.props.selecting && !!$store.state.algoliaSelect.props.selecting.multiple,
            quick: !!$store.state.algoliaSelect.props.selecting && !!$store.state.algoliaSelect.props.selecting.quick,
          }"
          :selected="null"
          :classes="!!$store.state.algoliaSelect.props.classes ? $store.state.algoliaSelect.props.classes : {}"
          :search-query="typeof $store.state.algoliaSelect.props.searchQuery === 'string' ? $store.state.algoliaSelect.props.searchQuery : ''"
          :selected-values="!!$store.state.algoliaSelect.props.selectedValues ? $store.state.algoliaSelect.props.selectedValues : []"
          :card-style="!!$store.state.algoliaSelect.props.cardStyle ? $store.state.algoliaSelect.props.cardStyle : 'media-above'"
          @submit="onSubmit"
          @update="onUpdate"
          @cancel="onCancel"
          @closed="(e) => {
            $store.commit('algoliaSelect/resetState');
          }"
        />
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  computed: {
    isProductPage() {
      return this.$route.path.split('/')[1] === 'products'
    }
  },
  methods: {
    onSubmit(e) {
      const onSubmit = this.$store?.state?.algoliaSelect?.onSubmit ? this.$store.state.algoliaSelect.onSubmit : (val) => val
      onSubmit(e)
    },
    onUpdate(e) {
      const onUpdate = this.$store?.state?.algoliaSelect?.onUpdate ? this.$store.state.algoliaSelect.onUpdate : (val) => val
      onUpdate(e)
    },
    onCancel(e) {
      const onCancel = this.$store?.state?.algoliaSelect?.onCancel ? this.$store.state.algoliaSelect.onCancel : (val) => val
      onCancel(e)
    }
  }
})
</script>