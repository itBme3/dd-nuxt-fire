<template>
<div class="rich-select">
  <label v-if="label && selectedOptions.length">{{ label }}:</label>
  <gRichSelect
    ref="richSelect"
    v-model="selectedOptions"
    :options="selectOptions"
    :value-attribute="valueAttribute"
    :text-attribute="textAttribute"
    :multiple="multiple"
    :clearable="clearable"
    :close-on-select="closeOnSelect"
    :placeholder="placeholder"
    :max-height="maxHeight"
    :variant="variant"
    :classes="classes"
    :delay="0"
    :fetch-options="typeof fetchOptions === 'function' ? fetchOptions : undefined"
    @click="scrollTo('richSelect', -100)"
    >
    <template
        v-if="canCreate"
        slot="dropdownDown"
        slot-scope="{ query }"
      >
      
        <div
          v-if="query 
            && !selectedOptions.map(o => valueAttribute === null ? o.toLowerCase() : o[valueAttribute].toLowerCase()).includes(query.toLowerCase())
            && !$refs.richSelect.filteredOptions.map(o => o.value.toLowerCase()).includes(query.toLowerCase())"
          class="text-center"
        >
          <gButton
            type="button"
            class="w-full p-3 text-white bg-blue-500 hover:bg-blue-600"
            @click="createOption(query)"
          >
            Create "{{ query }}"
          </gButton>
        </div>
      </template>
      <template #arrow>
          <i class="gicon gicon-add rounded-full transform transition-transform scale-100 hover:scale-105 p-2 hover:shadow-2xl shadow" />
      </template>
  </gRichSelect>
  </div>
</template>

<script>
import { objectsAreTheSame } from '~/utils/funcs'
export default {
  props: {
    options: {
      type: [Array, Object],
      default: () => []
    },
    valueAttribute: {
      type: String,
      default: null
    },
    textAttribute: {
      type: String,
      default: null
    },
    descriptionAttribute: {
      type: String,
      default: null
    },
    mediaAttribute: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'select...'
    },
    label: {
      type: String,
      default: null
    },
    maxHeight: {
      type: Number,
      default: 300
    },
    variant: {
      type: String,
      default: null
    },
    fetchOptions: {
      type: Function,
      default: undefined
    },
    canCreate: {
      type: Boolean,
      default: true
    },
    selected: {
      type: [String, Array],
      default: () => []
    },
    classes: {
      type: Object,
      default: () => { return undefined }
    }
  },
  data() {
    return {
      selectOptions: this.options,
      selectedOptions: this.multiple ? [undefined, null].includes(this.selected) ? [] : JSON.parse(JSON.stringify(this.selected))
        : typeof this.selected === 'string' ? this.selected : null,
    }
  },
  watch: {
    options(val) {
      this.selectOptions = val
    },
    selected(val) {
      console.log({val, selectedOptions: this.selectedOptions})
      if(objectsAreTheSame(val, this.selectedOptions)) { return }
      this.selectedOptions = typeof val === 'string' ? val : JSON.parse(JSON.stringify(val))
    },
    selectedOptions(val) {
      this.$emit('update', val)
    }
  },
  created() {
    setTimeout(() => {
      this.selectedOptions = this.multiple
        ? [null, undefined, [], ''].includes(this.selected) 
          ? [] 
          : !Array.isArray(this.selected)
            ? [this.selected]
            : this.selected
          : [null, undefined, [], ''].includes(this.selected)
                ? null
                : Array.isArray(this.selected) 
                  ? this.selected[0] 
                  : null;
    }, 1000);
  },
  methods: {
    createOption (text) {
      const newOption = typeof this.valueAttribute === 'string' && !!this.valueAttribute?.length
        ? { [this.valueAttribute]: text }
        : text;
      this.selectOptions.push(newOption)
      if(this.multiple) {
        this.selectedOptions.push(newOption)
      } else {
        this.selectedOptions = newOption
      }
    },
    scrollTo(refName, offset = 0) {
      const element = this.$refs[refName]?._vnode?.elm || this.$refs[refName];
      const top = element.classList.contains('modal-overlay') ? element.childNodes[0].offsetTop - 200 : element.offsetTop + offset;
      window.scrollTo({top, left: 0, behavior: 'smooth'});
    }
  }
}
</script>