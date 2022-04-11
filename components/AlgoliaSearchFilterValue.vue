<template>
  <div v-if="!!filter"
    class="algolia-filter-value"
    :class="{
      'border border-white border-opacity-5 rounded mb-2 shadow-lg': !isOr,
      'bg-black bg-opacity-5': isOr
    }">
    <gButton
      v-if="!isOr || filter.value === undefined"
      class="remove-filter"
      @click="$emit('change', null)">
      <Icon :name="'close'" class="m-auto transform scale-80" />
    </gButton>
    <p v-if="filter.value === undefined">
      {{ filter.attribute }}
    </p>
    <small v-if="isOr" 
      class="or-filter-separator text-gray-600 dark:text-gray-300">
      or
    </small> 
    <div :class="{
        'a-filter': true,
        [filter.type]: true,
        'star-range': filter.type === 'range' && filter.attribute === 'score'
      }">

      <template v-if="filter.type === 'refinement_list'">
        <template  v-if="filter.value !== undefined">
          <div
            v-if="isOr"
            class="rounded-md border-gray-600 px-2 py-1 relative"
            >
            <p class="algolia-search-filter-value-text">
              <small class="my-auto mr-1 text-xs text-gray-600">{{ filter.attribute }}:</small>
              <span class="my-auto">{{ filter.value }}</span>
            </p>

            <gButton
              class="remove-filter"
              @click="() => $emit('change', null)"
              >
              <Icon
                :name="'close'"
                class="m-auto transform scale-80"
              />
            </gButton>
          </div>
          <p v-else class="algolia-search-filter-value-text">
            <small>{{ filter.attribute }}:</small>
            <span>{{ filter.value }}</span>
          </p>
        </template>
        <AlgoliaSearchRefinements 
          v-else
          :index-name="indexName"
          :index="index"
          :index-filters="filter.not ? null : indexFilters"
          :attribute="filter.attribute"
          @change="(e) => e === undefined ? $emit('change', null) : updateValue(e)"
        />
      </template>

      <template v-else-if="filter.type === 'range'">
        <template v-if="[ 'score', 'rating'].includes(filter.attribute)">
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
          <small class="text-sm">TO</small>
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
import Vue from 'vue'
export default Vue.extend({
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
    },
    index: {
      type: Object,
      default: null
    },
    indexFilters: {
      type: Array,
      default: () => []
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
      this.$emit('change', this.filter)
    },
    updateValue(val) {
       this.filter.value = val
      // if(this.filter.value !== undefined)
        this.$emit('change', this.filter)
    }
  }
})
</script>

<style lang="scss" scoped>
.algolia-filter-value  {
  @apply  relative p-2;
  .filter-value {
    &.parent {
      @apply mb-4 bg-gray-800;
    }
  }
}
.parent {
  > .algolia-filter-value {
    @apply mb-4 bg-gray-800 bg-opacity-30 transform scale-97;
  }
}
.remove-filter {
  @apply rounded-full p-0 text-xs scale-90 text-opacity-60 bg-black bg-opacity-5 hover:bg-red-500 hover:bg-opacity-100 hover:text-red-900 hover:text-opacity-100 h-6 w-6 text-center flex items-center content-center absolute right-1 top-1;
}
.algolia-search-filter-value-text {
  @apply flex items-center content-start -mx-1 w-full;
  small {
    @apply my-auto mr-1 text-xs truncate text-gray-600 w-10;
  }
  span {
    @apply my-auto;
  }
}
.or-filter-separator {
  @apply text-gray-600 dark:text-gray-300 block w-full m-0 pt-1 border border-gray-800 border-x-0 border-b-0;
}
/* nested "or" filter values */
.algolia-filter-value .algolia-filter-value {
  @apply mb-0;
  @apply px-0 #{!important};
  .remove-filter {
    @apply -mt-6;
  }
  .a-filter {
    > div {
       @apply p-0 #{!important};
    }
  }
  
  // .algolia-search-filter-value-text {
  //   @apply  border border-gray-800 border-x-0 border-b-0 px-1;
  // }
}
</style>