import Vue from 'vue'
import PerfectScrollbar from 'vue2-perfect-scrollbar'

Vue.use(PerfectScrollbar, {
  name: 'scrollbar',
  watchOptions: true,
  maxScrollbarLength: 60,
  minScrollbarLength: 10,
  scrollYMarginOffset: 100
})
