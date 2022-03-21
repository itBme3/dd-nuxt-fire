<template>

  <gModal ref="modal"
    :class="{
      'quick-select': !!selecting.quick
    }"
    :variant="'selecting'"
    :esc-to-close="!(selectingOptions && selectingOptions.quick)"
    @before-close="beforeClose"
    @before-open="beforeOpen"
    @opened="(e) => $emit('opened', e)"
    @closed="(e) => $emit('closed', e)"
    >
    <!-- <pre class="text-green-300"><code>{{JSON.stringify(selecting, null, 4)}}</code></pre> -->
    <AlgoliaSearch
      ref="algoliaSearch"
      :update-url="false"
      :index-name="indexName"
      :search-query="search"
      :selected-values="selected"
      :filtering="!!filtering && (!!!selecting || !!!selecting.quick)"
      :classes="classes"
      :card-style="cardStyle"
      :filter-values="filterValues"
      :fetch-next-page="fetchNextPage"
      :selecting="selectingOptions"
      @selection="updateSelection"
      >
      <template #headerStart>
        
      </template>
      <template #headerEnd>
        <div class="buttons modal-actions flex space-x-1 ml-1">
          <gButton
            class="px-2 py-0 h-13 flex justify-center items-center bg-green-400 text-green-900"
            @click="submitSelection()"
            >
            DONE
          </gButton>
          <gButton
            class="text-red-500 hover:bg-red-500 hover:text-red-900 px-3 py-0 h-13 flex justify-center items-center icon-button"
            @click="cancelSelection()"
            >
            <Icon :name="'close'" />
          </gButton>
        </div>
      </template>
    </AlgoliaSearch>
    <slot :name="'selectedItems'" />
  </gModal>


</template>

<script>
const defaultSelecting = { 
  identifier: 'id',
  hideSelected: true,
  hideSideNav: false,
  quick: false,
  multiple: true
} 

export default {
  props: {
    indexName: {
      type: String,
      default: null
    },
    searchQuery: {
      type: String,
      default: ''
    },
    filtering: {
      type: Boolean,
      default: true
    },
    constantFilters: {
      type: Array, /* AlgoliaFilterObject[] */
      default: () => []
    }, 
    filterValues: {
      type: Object,
      default: () => { return {} } /* { filters: AlgoliaFilterObject[] } */
    },
    selecting: {
      type: [Object, Boolean],
      default: () => defaultSelecting
    },
    selectedValues: {
      type: Array,
      default: () => []
    },
    cardStyle: {
      type: String, /* 'media-above' | 'media-left' | 'media-left' */
      default: 'media-above'
    },
    classes: {
      type: Object,
      default: () => {
        return {
          grid: '',
          hit: '',
          card: '',
          title: '',
          content: '',
          media: '',
        }
      }
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
      selected: JSON.parse(JSON.stringify(this.selectedValues)),
      fetchNextPage: false,
      selectingOptions: [undefined, true, null].includes(this.selecting) ? defaultSelecting : this.selecting
    }
  },
  computed: {
    multiple() {
      return !!this.selecting?.multiple
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
    if(this.showing){
      this.showModal()
    }
  },
  unmounted() {
    this.showing = false
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
    beforeClose(e) {
      if(document.body.classList.contains('modal-active')) {
        document.body.classList.remove('modal-active');
      }
      this.$emit('before-close', e)
    },
    beforeOpen(e) {
      if(!document.body.classList.contains('modal-active')) {
        document.body.classList.add('modal-active');
      }
      this.$emit('before-open', e)
    },
    updateSelection(selected) {
      console.log(selected)
      this.selected = selected;
      if (!this.multiple) {
        this.submitSelection();
        return
      }
      this.$emit('selection', this.selected);
    },
    submitSelection() {
      this.showing = false
      this.$emit('submit', !this.multiple ? this.selected[0] : this.selected)
      // this.$refs.modal.hide()
    },
    cancelSelection() {
      this.showing = false
      this.$emit('cancel', true)
      // this.$refs.modal.hide()
    },
  }
}
</script>

<style lang="scss">
.modal-overlay {
  @apply pt-96
}
</style>