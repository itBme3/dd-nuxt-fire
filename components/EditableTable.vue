<template>
  <div v-if="Object.keys(tableSettings).length">
    <HotTable 
      :settings="tableSettings"
      class="mx-auto w-full max-w-lg rounded-xl overflow-hidden shadow-2xl"></HotTable>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
  registerAllModules();

  export default {
    components: {
      HotTable
    },
    props: {
      columns: {
        type: Array,
        default: () => []
        /* options: http://tabulator.info/docs/4.2/columns */
      },
      rows: {
        type: Array,
        default: () => null
      }
    },
    data() {
      return {
        tableSettings: {}
      }
    },

    fetch() {
      this.setTableData()
      this.tableSettings.colHeaders = this.columns.map(col => col.headerName)
      this.tableSettings.rowHeaders = false
      this.tableSettings.readOnly = false
      this.tableSettings.width = 'auto'
      this.tableSettings.height = 'auto'
      this.tableSettings.manualRowMove = true
      this.tableSettings.columns = function () {
          return {
            type: 'text',
            readOnly: false,
          }
        }
        this.tableSettings.width = '100%';
      this.tableSettings.className = 'text-center';
      this.tableSettings.licenseKey = 'non-commercial-and-evaluation'
      this.tableSettings.stretchH =  'all'
      this.tableSettings.afterChange = function (change, source) {
        console.log({change, source})
          if (source === 'loadData') {
            return; // don't save this change
          }
          if (!autosave.checked) {
            return;
          }
          clearTimeout(autosaveNotification);
      }
    },
    watch: {
      columns() {
        this.setTableData()
      },
      rows() {
        this.setTableData()
      }
    },
    methods: {
      setTableData() {
        this.tableSettings.data = []
        this.rows.forEach(row => 
          this.tableSettings.data.push(this.columns.map(col => row[col.field]))
        )
      }
    }
  }
</script>

