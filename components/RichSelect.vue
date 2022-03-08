<template>
<div>
  <gRichSelect
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
    :delay="0"
    :fetch-options="typeof fetchOptions === 'function' ? fetchOptions : undefined"
    @input="(e) => $emit('update', e)"
    >
    <template
        v-if="canCreate"
        slot="dropdownDown"
        slot-scope="{ query }"
      >
        <div
          v-if="query"
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
  </gRichSelect>
</div>
</template>

<script>
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
      default: () => null
    }
  },
  data() {
    return {
      selectOptions: this.options,
      selectedOptions: this.multiple ? [] : null
    }
  },
  watch: {
    options() {
      this.selectOptions = this.options
    },
    selected() {
      this.selectedOptions = this.selected
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
                  : null
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
    }
  }
}
</script>