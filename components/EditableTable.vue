<template>
  <div v-if="Object.keys(tableSettings).length">
    <HotTable 
      ref="tableComponent"
      :settings="tableSettings"
      class="mx-auto w-full max-w-lg rounded-xl overflow-hidden shadow-2xl" />
      <template v-if="renamingColumn.value">
        <div
          class="form-field z-999 fixed w-42"
            :style="{
              left: renamingColumn.x + 'px',
              top: renamingColumn.y + 'px',
              transform: 'translateY(-100%) translateX(-50%)'
            }">
          <gInput 
            ref="colNameInput"
            v-model="renamingColumn.value"
            @keyup.enter="setColumnName()"
            @keyup.esc="renamingColumn = { value: null, x: null, y: null, index: null, current: null }"
          />
          <div class="absolute right-0 top-1/2 -translate-y-1/2">
            <Btn
              v-if="renamingColumn.value !== renamingColumn.current"
              class="text-green-400 bg-transparent icon-button"
              @click="setColumnName()">
              <Icon name="tick" />
            </Btn>
          </div>
        </div>
        <div class="fixed inset-0 cursor-pointer z-99"
          @click="renamingColumn = { value: null, x: null, y: null, index: null, current: null }" />
      </template>
  </div>
</template>

<script>
import Vue from 'vue'
import { HotTable } from '@handsontable/vue';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { handleize } from '~/utils/funcs';
  registerAllModules();

export default Vue.extend({
    components: {
      HotTable
    },
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      rows: {
        type: Array,
        default: () => null
      }
    },
    data() {
      const addColumn = this.addColumn.bind(this)
      const renameColumn = this.renameColumn.bind(this)
      const afterChange = this.afterChange.bind(this)
      return {
        renamingColumn: {
          value: null,
          x: null,
          y: null,
          index: null,
          current: null,
        },
        tableSettings: {
          rowHeaders: false,
          readOnly: false,
          autoSave: false,
          width: 'auto',
          height: 'auto',
          manualRowMove: true,
          columns() {
            return {
              type: 'text',
              readOnly: false,
            }
          },
          className: 'text-center',
          licenseKey: 'non-commercial-and-evaluation',
          stretchH:  'all',
          afterChange,
          minSpareRows: true,
          dropdownMenu: {
            items: [
              {
                key: 'rename_col',
                name: "Rename",
                callback(key, selection, clickEvent) { // Callback for specific option
                  renameColumn(clickEvent, selection)
                }
              },
              {
                key: 'add_col_left',
                name: "Add Column (left)",
                callback(key, selection, clickEvent) { // Callback for specific option
                  addColumn(selection[0].end.col)
                }
              },
              {
                key: 'add_col_right',
                name: "Add Column (right)",
                callback(key, selection, clickEvent) { // Callback for specific option
                  addColumn(selection[0].end.col + 1)
                }
              },
              {
                key: 'delete_col',
                name: "Delete",
                callback(key, selection, clickEvent) { // Callback for specific option
                }
              },
            ]
          },
          contextMenu: [
            'row_above',
            'row_below',
            'remove_row'
          ]
        }
      }
    },

    fetch() {
      this.setTableData()
      this.tableSettings.colHeaders = this.columns.map(col => col.headerName)
      
    },
    // watch: {
    //   columns() {
    //     this.setTableData()
    //   },
    //   rows() {
    //     this.setTableData()
    //   }
    // },
    methods: {

      setTableData() {
        this.tableSettings.data = []
        this.rows.forEach(row => 
          this.tableSettings.data.push(this.columns.map(col => row[col.field]))
        )
      },

      addColumn(indx) {
        const tableData = this.$refs.tableComponent.hotInstance.getData()
        this.tableSettings = {
          ...this.tableSettings,
          colHeaders: indx === 0 
            ? ['New', ...this.tableSettings.colHeaders] 
            : [...this.tableSettings.colHeaders.slice(0, indx), 'New', ...this.tableSettings.colHeaders.slice( indx, this.tableSettings.colHeaders.left)],
          data: [...tableData
            .map(row => indx === 0 
              ? ['', ...row]
              : [...row.slice(0, indx), '', ...row.slice( indx, row.length)]
            )]
        }
        this.$refs.tableComponent?.hotInstance.updateSettings(this.tableSettings);
        setTimeout(()=> {
        }, 500)
      },

      renameColumn(e, selection) {
        const columns = this.$refs.tableComponent?.hotInstance.getColHeader()
        
        const index = selection[0].end.col
        this.renamingColumn = {
          value: columns[index],
          current: columns[index],
          x: e.x,
          y: e.y,
          index
        }
        setTimeout(() => {
          this.$refs.tableComponent?.hotInstance.deselectCell()
        }, 100)
        setTimeout(() => {
          this.$refs.colNameInput.select()
        }, 200)
      },

      setColumnName() {
        const instance = this.$refs.tableComponent.hotInstance;
        const data = instance.getData()
        this.tableSettings = {
          ...this.tableSettings,
          data,
          colHeaders: this.tableSettings.colHeaders
            .map((colHeader, i) => this.renamingColumn.index === i ? this.renamingColumn.value : colHeader)
        }
        instance.updateSettings(this.tableSettings);
        this.afterChange();
        this.renamingColumn = { value: null, index: null, x: null, y: null }
      },

      afterChange() {
        const columns = this.$refs.tableComponent.hotInstance.getColHeader()
          .reduce((acc, headerName) => {
            const currentKeys = acc.map(h => h.field);
            const getHeaderKey = () => {
              let headerKey = handleize(headerName).split('-').join('_');
              if (currentKeys.includes(headerKey)) {
                for (let i = 2; i < 999 && currentKeys.includes(headerKey); i++) {
                  headerKey = `${headerKey}_${i}`
                }
              }
              return headerKey
            }
            return [...acc, {
              field: getHeaderKey(headerName),
              headerName
            }]
          }, []);

        const rows = this.$refs.tableComponent.hotInstance.getData()
          .map(row => row.reduce((acc, col, i) => {
            return {...acc, [`${columns[i].field}`]: col}
          }, {}));
        this.$emit('change', { rows, columns })
      }
    },
  })
</script>

