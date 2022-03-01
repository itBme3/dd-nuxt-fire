<template>
  <div class="page-content images">
    <Title>Images:</Title>
    <AlgoliaSearch 
      :index-name="'media'" 
      :card-classes="'rounded-sm p-0'"
      :selecting="selected === null ? false : {
        identifier: 'objectID'
      }"
      :selected-values="selected === null ? [] : selected"
      @selection="(e) => selected = e"
    >
    
    <template #headerStart>
      <gButton class="h-13 mr-1"
        @click="() => selected === null ? selected = [] : selected = null">
        <small class="uppercase font-normal">Bulk</small> <Icon :name="selected === null ? 'edit' : 'close'" class="ml-2 mr-0 transform scale-90" />
      </gButton>
    </template>
      <template #headerAfter>
        <div
          :class="{'bulk-actions': true, 'hidden': selected === null || selected.length === 0}">
          <gButton>
            add attributes
          </gButton>
          <gButton>
            remove attributes
          </gButton>
          <gButton>
            delete
          </gButton>
        </div>
    </template>
    
    </AlgoliaSearch>
  </div>
</template>
<script>
export default {
  data() {
    return {selected: null}
  },
  methods: {
    
  }
}
</script>
<style lang="scss">
  .bulk-actions {
    @apply relative space-x-2 flex rounded bg-gray-50 dark:bg-gray-900 p-3 shadow-2xl shadow-gray-900;
  }
</style>

