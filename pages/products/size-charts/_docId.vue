<template>
  <div v-if="updates && updates.rows.length"
    class="product-size-charts mx-auto max-w-lg">
    <Title>Size Chart:</Title>
    
    <div class="flex items-center content-start mb-4">
      <gButton
        class="w-28 h-28 flex items-center content-center rounded overflow-hidden"
        :class="{'p-0': updates.image && updates.image !== null}"
        @click="changeImage()">
        <Media
          v-if="updates.image && updates.image !== null"
          :media="{downloadUrl: updates.image}"
        />
        <Icon v-else name="image" class="m-auto" />
      </gButton>
      <div class="ml-4">
        <gInput
          v-model="chart"
          class="rounded" />
        <small class="font-italic "><span class="text-gray-500">product tag 👉 &nbsp; </span> chart:{{ updates.chart }}</small>
      </div>
    </div>
    <div class="actions float-right mb-4 flex items-center space-x-1">
      <Btn 
        v-tooltip="{content: 'duplicate', placement: 'top', offset: '5px' }"
        class="hover:bg-blue-500 w-8 h-8 flex items-center content-center dark:hover:bg-blue-500 dark:hover:text-blue-900 hover:text-blue-900 icon-button rounded-full text-gray-500 bg-gray-200 dark:bg-gray-600 dark:text-gray-900 shadow-xl"
        @click="duplicateChart()">
        <Icon name="duplicate" class="m-auto" />
      </Btn>

      <ButtonDelete 
        tooltip-text="Delete Chart"
        @delete="deleteChart()">
        Delete
      </ButtonDelete>

      <Btn 
        v-if="hasChanges"
        class="hover:bg-green-300 text-green-300 hover:text-green-900"
        @click="saveChanges()">
        Save <Icon name="save" />
      </Btn>
    </div>
    <EditableTable 
      :columns="updates.columns"
      :rows="updates.rows"
      class="mx-auto w-calc(100%-2rem) max-w-xl"
      @change="e => {
        updates.rows = e.rows;
        updates.columns = e.columns;
        if(!balancedData) {
          balancedData = true;
          doc.rows = e.rows;
          doc.columns = e.columns;
        }
      }"
    />
  </div>
</template>

<script>
import { objectsAreTheSame } from '~/utils/funcs';
import { duplicateChart, deleteChart } from '~/utils/product-charts';
const defaultDoc = { chart: null, image: null, rows: [], columns: [] }
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      updates: defaultDoc,
      doc: defaultDoc,
      balancedData: false
    }
  },
  computed: {
    chart: {
      get() {
        return this.updates?.chart || null
      },
      set(val) {
        this.updates.chart = val
      }
    },
    hasChanges() {
      return !objectsAreTheSame(this.doc, this.updates)
    }
  },
  mounted() {
    this.$db.doc(`size_charts/${this.$route.params.docId}`)
      .then((res) => {
        this.doc = res?.docId === this.$route.params.docId ? JSON.parse(JSON.stringify(res)) : null
        this.updates = JSON.parse(JSON.stringify(res))
      })
      .catch((err) => {alert(err)});
  },
  methods: {
    changeImage() {
      const submitting = (media) => {
        this.updates.image = media.downloadUrl
      }
      const onSubmit = submitting.bind(this)
      this.$store.commit('algoliaSelect/open', { props: {indexName: 'media', selecting: {multiple: false, identifier: 'objectID'}}, onSubmit })
    },
    duplicateChart() {
      duplicateChart(this.doc, this.$db)
    },
    deleteChart() {
      deleteChart(this.doc.docId, this.$db, this.$router)
    },
    saveChanges() {
      try {
        this.$db.updateAt(this.doc.docPath, this.updates)
          .then(res => {
            this.doc = res
          })
      } catch(err) {
        alert(err)
      }
    }
  }
})
</script>