<template>
  <div class="select-star-rating flex space-x-1 items-center content-start"
    @mouseleave="hovering = null">
    <gButton
      class="p-0 text-center bg-transparent hover:scale-100 text-gray-500 hover:text-red-500 cursor-pointer"
      @mouseenter="hovering = 0"
      @click="selectValue(0)"
    >
      <Icon
        :name="'cancel'"
        class="mr-0 relative top-px"
      />
    </gButton>
    <gButton 
      v-for="i in [1, 2, 3, 4, 5]"
      :key="i"
      class="p-0 text-center bg-transparent hover:scale-100"
      @click="selectValue(i)"
      @mouseenter="hovering = i"
      >
      <Icon 
        :name="hovering !== null ? hovering >= i ? 'star-full' : 'star-o' : selectedValue !== null && selectedValue >= i ? 'star-full' : 'star-o'"
        class="cursor-pointer mr-0"
      />
    </gButton>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      selectedValue: parseInt(this.value),
      hovering: null
    }
  },
  watch: {
    value(val) {
      this.selectedValue = parseInt(val)
    }
  },
  methods: {
    selectValue(e) {
      console.log({ e })
      this.selectedValue = e; 
      this.$emit('change', e)
    }
  }
})
</script>