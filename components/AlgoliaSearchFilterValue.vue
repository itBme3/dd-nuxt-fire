<template>
  <div v-if="!!filter"
    class="algolia-filter-value relative p-2 rounded border border-white border-opacity-5">
    <gButton
      class="remove-filter rounded-full p-0 text-xs scale-90 text-opacity-60 bg-black bg-opacity-5 hover:bg-red-500 hover:bg-opacity-100 hover:text-red-900 hover:text-opacity-100 h-6 w-6 text-center flex items-center content-center absolute right-1 top-1"
      @click="$emit('change', null)">
      <Icon :name="'close'" class="m-auto" /></gButton>
    <h4>{{ filter.attribute }}</h4>
    <div :class="{
        'a-filter': true,
        [filter.type]: true,
        'star-range': filter.type === 'range' && filter.attribute === 'score'
      }">

      <template v-if="filter.type === 'refinement_list'">
        <code>todo: refinement_list</code>
      </template>

      <template v-else-if="filter.type === 'range'">
        <template v-if="filter.attribute === 'score'">
          <SelectStarRating
            :value="!!filter && !!filter.value && !!filter.value[0] ? filter.value[0] : null"
            @change="(e) => updateValue(!!!filter || !!!filter.value || !Array.isArray(filter.value) || filter.value.length <= 1 ? [e, e] : [e, filter.value[1]])"
          /> 
          <small>TO</small>
          <SelectStarRating
            :value="!!filter && !!filter.value && !!filter.value[1] ? filter.value[1] : null"
            @change="(e) => updateValue(!!!filter || !!!filter.value || !Array.isArray(filter.value) || filter.value.length < 1 ? [e, e] : [filter.value[0], e])"
          /> 
        </template>
        <template v-else>
          <gInput 
            :type="['updatedAt', 'createdAt'].includes(filter.attribute) ? 'date' : 'text'"
            :value="!!filter && !!filter.value && !!filter && Array.isArray(filter.value) && !!filter.value[0] ? filter.value[0] : undefined"
            @change="(e) => updateValue(!!!filter || !!!filter.value || !Array.isArray(filter.value) || filter.value.length <= 1 ? [e.target.value, e.target.value] : [e.target.value, filter.value[1]])" />
          <small>TO</small>
          <gInput 
            :type="['updatedAt', 'createdAt'].includes(filter.attribute) ? 'date' : 'text'"
            :value="!!filter && !!filter.value && Array.isArray(filter.value) && !!filter.value[1] ? filter.value[1] : undefined"
            @change="(e) => updateValue(!!!filter || !!!filter.value || !Array.isArray(filter.value) || filter.value.length < 1 ? [e.target.value, e.target.value] : [!!filter && !!filter.value && filter.value.length > 0 ? filter.value[0] : e.target.value, e.target.value])" />
        </template>
      </template>
      
      <template v-if="filter.type === 'number'">
          <gInput type="number"
            :value="filter.value" />
      </template>
      
    </div>
    <slot></slot>
    <!-- <pre><code>{{ JSON.stringify(filter, null, 2) }}</code></pre> -->
    
    <AlgoliaSearchFilterOptionsSelect
      v-if="!isOr"
      :index-name="indexName"
      :button-text="'or'"
      @change="addOrFilter"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => null
    },
    isOr: {
      type: Boolean,
      default: false
    },
    indexName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      filter: this.value
    }
  },
  watch: {
    value(val) {
        this.filter = val
    }
  },
  methods: {
    addOrFilter(val) {
      const newFilter = JSON.parse(JSON.stringify(val));
      if(!Array.isArray(this.filter.or)) this.filter.or = [];
      this.filter.or.push(newFilter)
      console.log({ filter: this.filter, newFilter })
      this.$emit('change', this.filter)
    },
    updateValue(val) {
       this.filter.value = val
      if(this.filter.value !== undefined)
        this.$emit('change', this.filter)
    }
  }
}
</script>