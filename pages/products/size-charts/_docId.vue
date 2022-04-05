<template>
  <div v-if="rows.length"
    class="product-size-charts">
    <Title class="text-center">Size Chart:</Title>
    <gInput v-model="chart" class="rounded mx-auto text-center mb-8 max-w-lg" />
    <EditableTable 
      :columns="columns"
      :rows="rows"
      class="mx-auto w-calc(100%-2rem) max-w-xl"
    />
  </div>
</template>

<script>
export default {
  async asyncData({ route, $db }) {
    console.log({$db, route})
    const doc = await $db.doc(`size_charts/${route.params.docId}`)
      .then((res) => res?.docId === route.params.docId ? res : null)
      .catch((err) => {
        alert(err)
        return null
      });
      return {doc}
  },
  computed: {
    rows() {
      return this.doc?.rows || []
    },
    columns() {
      return this.doc?.columns || []
    },
    chart: {
      get() {
        return this.doc?.chart || null
      },
      set(val) {
        this.doc.chart = val
      }
    }
  }
}
</script>