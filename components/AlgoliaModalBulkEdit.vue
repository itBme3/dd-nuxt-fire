<template>
  <gModal 
    ref="modal"
    class="algolia-modal-bulk-edit"
    :click-to-close="false"
    :esc-to-close="false"
    :disable-body-scroll="true"
    @before-close="beforeClose"
    @before-open="beforeOpen"
    @opened="(e) => $emit('opened', e)"
    @closed="(e) => $emit('closed', e)"
  >
    <template #header>
      <h4>{{ modalHeading }}</h4>
    </template>

    <template v-if="!saving">
      <template v-if="editType.includes('attributes')">
      <RichSelect
            v-for="key in Object.keys(values)"
            :key="key"
            :label="capitalize(editType.split('-')[0] + ' ' + key)"
            :close-on-select="false"
            :multiple="true"
            :variant="editType.includes('add') ? 'green' : 'red'"
            :fetch-options="selectFetchOptions(key)"
            :can-create="editType.includes('add')"
            :selected="values[key]"
            :value-attribute="null"
            :text-attribute="null"
            :placeholder="'select ' + key + '...'"
            @update="(e) => {
              values[key] = e
            }"
          />
      </template>
    </template>

    <template #footer>
      <gButton 
        :class="{
          'bg-red-400 hover:bg-red-500 text-red-900': ['delete', 'remove-attributes'].includes(editType),
          'bg-green-400 hover:bg-green-500 text-green-900': [ 'add-attributes'].includes(editType)
        }"
        class="uppercase w-full"
        :disabled="saving"
        @click="submit()"
      >
        <template v-if="!saving">{{ editType.split('-').join(' ') }}</template>
        <Loading v-else />
      </gButton>
    </template>

  </gModal>
</template>

<script>
  import Vue from 'vue'
  import { bulkEditOptionsByIndex } from '~/utils/algolia'
  import { asyncDelay, capitalize } from '~/utils/funcs'

  export default Vue.extend({
    props: {
      indexName: {
        type: String,
        default: null
      },
      editType: {
        type: String,
        default: null /* remove-attributes, add-attributes, delete */
      },
      selected: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        values: bulkEditOptionsByIndex[this.indexName]?.reduce((acc, key) => {
          return {...acc, [key]: []}
        }, {}) || null,
        index: this.$algolia.initIndex(this.indexName),
        saving: false
      }
    },
    computed: {
      modalHeading() {
        switch (this.editType) {
          case 'remove-attributes':
            return `Removing attributes from ${this.selected.length} items`
          case 'add-attributes':
            return `Adding attributes to ${this.selected.length} items`
          default:
            return `Deleting ${this.selected.length} items`;
        }
      },
      selectedValues() {
        return this.selected
      }
    },
    mounted() {
      this.$refs.modal.show()
    },
    methods: {
      capitalize,
      async submit() {
        this.saving = true
        if(this.editType === 'delete') {
          return await Promise.all(this.selected.map(doc =>
            this.$db.delete(`${this.indexName}/${doc.docId}`))
          ).then(async () => {
            await asyncDelay(2000)
            this.saving = false
            this.$emit('submitted')
          })
        }
        const keys = Object.keys(this.values).filter(key => this.values[key]?.length > 0)
        if(!keys.length) {
          this.saving = false
          return 
        }
        const newDocs = this.selected.reduce((acc, doc) => {
          const newDoc = {docId: doc.docId}
          keys.forEach(key => {
            if (this.editType.includes('add')) {
              newDoc[key] = [...doc[key], ...this.values[key].filter(v => !doc[key].includes(v))]
            }
            if (this.editType.includes('remove')) {
              newDoc[key] = doc[key]?.filter(val => !this.values[key].includes(val)) || []
            }
          })
          return [...acc, newDoc]
        }, [])
        return Promise.all(newDocs.map(doc =>
          this.$db.updateAt(`${this.indexName}/${doc.docId}`, doc)
        )).then(async () => {
          await asyncDelay(4000)
          this.saving = false
          this.$emit('submitted')
          this.$refs.modal.hide()
        })
      },
      selectFetchOptions(key) {
       const func = (e) => {
          if(this.editType.includes('add')) {
            return this.index.searchForFacetValues(key, e)
              .then(res => res.facetHits)
              .then(results => { return {results: results.map(item => item.value)} });
          }
          const foundValues = this.selected.reduce((acc, hit) => {
            const newValues = Array.isArray(hit[key]) 
              ?  hit[key].filter(val => !acc.includes(val))
              : []
            return [...acc, ...newValues]
          }, [])
          return new Promise((resolve) => resolve({results:  foundValues.filter(val => e === '' || e.toLowerCase().split(' ').filter(word => val.toLowerCase() === word ||  val.toLowerCase().includes(word)))}))
        }
        return func.bind(this)
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
    }
  })
</script>

<style scoped>

</style>