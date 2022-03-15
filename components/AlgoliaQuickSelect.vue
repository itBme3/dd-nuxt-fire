<template>
  <AlgoliaModalSelect
      class="quick-select" 
      :classes="theClasses"
      :card-style="cardStyle"
      :index-name="indexName"
      :constant-filters="constantFilters"
      :selected-values="selectedValues"
      :search-query="typeof searchQuery === 'string' ? searchQuery : ''"
      :selecting="selecting"
      :show="show"
      @after-close="(e) => $emit('after-close', e)"
      @before-close="(e) => $emit('before-close', e)"
      @after-open="(e) => $emit('after-open', e)"
      @before-open="(e) => $emit('before-open', e)"
      @selection="(e) => {
        $emit('selection', e);
        selected = e
      }"
      @submit="(e) => $emit('submit', e)">
        <pre class="text-yellow-300"><code>{{JSON.stringify(selecting, null, 4)}}</code></pre>
      <template #selectedItems>
        <div 
          v-if="selected && selected.length"
          class="quick-selection mt-3"
        >

          <Card 
            v-for="(item, i) in selected"
            :key="item.handle"
            class="w-full mb-2 group p-0"
            :class="{
              [classes && classes.selected && classes.selected.card ? classes.selected.card : '']: true
            }"
            :card-style="'media-left'">

            <template #media>
              <Media 
                v-if="(Array.isArray(item.images) && item.images.length) || (typeof item.downloadUrl === 'string' && item.downloadUrl.length) || (typeof item.image === 'string' && item.image.length)"
                class="image cursor-move w-full h-full rounded shadow-md max-w-sm max-h-[380px] mx-auto sm:ml-auto sm:mr-0"
                :class="{ 
                  [classes && classes.selected && classes.selected.media ? classes.selected.media : '']: true
                }"
                :media="Array.isArray(item.images) && item.images.length ? item.images[0] : item"
                :is-background="true"
                ratio="6:1"
              />
            </template>

            <h5 v-if="typeof item.title === 'string' && item.title.length">{{ item.title }}</h5>
            <p v-if="typeof item.content === 'string' && item.content.length">{{ item.content }}</p>

            <template #after>
              <ButtonDelete
                confirm-text="Remove"
                tooltip-text="Remove This"
                class="absolute right-1 top-1 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                @delete="() => {
                  selected.splice(i, 1);
                  $emit('update', item);
                }"
              />
            </template>
          </Card>
          
        </div>
      </template>
  </AlgoliaModalSelect>
</template>

<script>
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
      constantFilters: {
        type: Array, /* AlgoliaFilterObject[] */
        default: () => []
      }, 
      selection: {
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
                quick: false,
                multiple: true
              } 
            */
        },
      selectedValues: {
        type: Array,
        default: () => []
      },
      cardStyle: {
        type: String, /* 'media-above' | 'media-left' | 'media-right' */
        default: 'media-left'
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
            selected: {
              card: '',
              media: ''
            }
          }
        }
      }, 
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const theClasses = this.classes ? this.classes : {};
      
      return {
        selected: Array.isArray(this.selectedValue) ? this.selectedValues : [],
        theClasses: { ...theClasses, card: 'bg-gray-200 text-gray-700' }
      }
    }
  }
</script>

<style lang="scss">
.quick-select {
  &.modal-overlay {
    @apply pt-0 absolute;
    .modal-modal {
      @apply py-0 max-h-[80vh];
      .modal-body {
        @apply overflow-y-scroll  py-0;
        .hits {
          @apply pt-3 #{!important}
        }
      }
        
    }
  }
}
</style>