<template>
  <div class="page-content images">
    <Title>Images:</Title>

    <LazyAlgoliaSearch 
      :index-name="'media'" 
      :card-classes="'rounded-sm p-0'"
      :selecting="selected === null ? false : {
        identifier: 'objectID',
        multiple: true,
        selected: selected,
        hideSelected: false
      }"
      :selected-values="selected === null ? [] : selected"
      @selection="(e) => selected = e"
    >
      <template #headerStart>
        <gButton 
          v-if="selected.length"
          class="h-13 mr-1"
          @click="() => selected = []">
          <small class="uppercase font-normal">Bulk</small> <Icon name="close" class="ml-2 mr-0 transform scale-90" />
        </gButton>
      </template>
        <template #headerAfter>
          <div
            :class="{'bulk-actions': true, 'hidden': !selected.length}">
            <gButton @click="editing = 'add-attributes'">
              add attributes
            </gButton>
            <gButton @click="editing = 'remove-attributes'">
              remove attributes
            </gButton>
            <gButton @click="editing = 'delete'">
              delete
            </gButton>
          </div>
          {{ editing }}
      </template>

    </LazyAlgoliaSearch>

    <template v-for="editType in ['add-attributes', 'remove-attributes', 'delete']">
      <LazyAlgoliaModalBulkEdit
        v-if="editType === editing"
        :key="editType"
        :selected="selected"
        :edit-type="editType"
        index-name="media"
        @before-close="editing = null"
        @submitted="bulkSubmitted"
      />
    </template>
  </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      selected: [],
      editing: null, /* remove-attributes, add-attributes, delete */
    }
  },
  methods: {
    bulkSubmitted() {
      this.editing = null
      this.selected = []
    }
  }
})
</script>
<style lang="scss">
  .bulk-actions {
    @apply relative space-x-2 flex rounded bg-gray-50 dark:bg-gray-900 p-3 shadow-2xl shadow-gray-900;
  }
</style>

