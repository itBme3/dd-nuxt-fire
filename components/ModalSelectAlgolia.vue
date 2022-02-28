<template>
<div>
  <gModal ref="modal"
    :variant="'selecting'">
    <AlgoliaSearch
      :update-url="false"
      :index-name="indexName"
      :search-query="search"
      :selected-values="selected"
      :filtering="!!filtering"
      :card-classes="cardClasses"
      :card-style="cardStyle"
      :filters-value="filtersValues"
      :fetch-next-page="fetchNextPage"
      @selection="updateSelection">
      <template #headerStart></template>
      <template #headerEnd>
        <div class="buttons modal-actions flex space-x-1 ml-1">
          <gButton
            class="px-2 py-0 h-13 flex justify-center items-center bg-green-400 text-green-900"
            @click="submitSelection()"
            >
            DONE
          </gButton>
          <gButton
            class="px-3 py-0 h-13 flex justify-center items-center icon-button"
            @click="cancelSelection()"
            >
            <Icon :name="'close'" class="text-red-500 hover:bg-red-500 hover:text-red-900" />
          </gButton>
        </div>
      </template>
    </AlgoliaSearch>
  </gModal>
  <!-- <gButton @click="() => showModal()">open</gButton> -->
</div>
</template>
<script>
export default {
  props: {
    indexName: {
      type: String,
      default: null
    },
    filtering: {
      type: Boolean,
      default: true
    },
    searchQuery: {
      type: String,
      default: ''
    },
    constantFilters: {
      type: Array, /* AlgoliaFilterObject[] */
      default: () => []
    }, 
    cardClasses: {
      type: String,
      default: () => ''
    }, 
    cardStyle: {
      type: String, /* 'media-above' | 'media-left' | 'media-left' */
      default: 'media-above'
    },
    filtersValues: {
      type: Object,
      default: () => { return {} }
    },
    selectedValues: {
      type: Array,
      default: () => []
    },
    selecting: {
      type: [Object, Boolean],
      default: () => true
        /*
        true defaults to:
            { 
              identifier: 'id',
              hideSelected: true,
              hideSideNav: false, 
            } 
          */
      },
      multiple: {
        type: Boolean,
        default: true
      },
      show: {
        type: Boolean,
        default: false
      }
  },
  data() {
    return { 
      showing: this.show,
      search: this.searchQuery,
      selected: this.selectedValues,
      fetchNextPage: false
    }
  },
  watch: {
    searchQuery() {
      this.search = this.searchQuery
    },
    selectedValues() {
      this.selected = this.selectedValues
    },
    show() {
      this.showing = this.show;
    },
    showing() {
      if(this.showing) return this.showModal();
      this.$refs.modal.hide()
    }
  },
  mounted() {
    this.$refs.modal.beforeClose( function() {
      this.showing = false;
    })
    if(this.showing)
      this.showModal()
  },
  methods: {
    showModal() {
      this.$refs.modal.show();
      setTimeout(() => {
        this.$refs.modal._vnode.elm.addEventListener('scroll', (e) => {
          const scrollLeftover = e.srcElement.scrollHeight - (e.srcElement.scrollTop + e.srcElement.offsetHeight);
          this.fetchNextPage = scrollLeftover < 100;
          if(this.fetchNextPage) {
            setTimeout(() => {
              this.fetchNextPage = false
            }, 250)
          }
        });
      }, 250)
    },
    updateSelection(selected) {
      this.selected = selected;
      if (!this.multiple) {
        this.submitSelection();
        return
      }
      this.$emit('selection', this.selected);
    },
    submitSelection() {
      this.$emit('submit', !this.multiple ? this.selected[0] : this.selected)
      this.$refs.modal.hide()
    },
    cancelSelection() {
      this.$emit('cancel', true)
      this.$refs.modal.hide()
    },
  }
}
</script>