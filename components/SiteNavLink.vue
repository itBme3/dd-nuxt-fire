<template>
  <div v-if="link && link.path !== null"
    class="site-nav-link flex items-center relative"
    :class="{
      'flex-col': isMobile
    }"
    @mouseleave="showNested = false"
    @mouseenter="showNested = true">
    <nuxt-link
      :to="link.path"
      class="w-full">
      <Btn :class="{
          'text-left justify-start group w-full bg-white dark:bg-opacity-5 text-gray-700 dark:text-gray-300 dark:hover:text-gray-900 hover:text-gray-900 hover:text-opacity-70 dark:hover:text-opacity-70': true,
          ['hover:bg-' + link.color + '-500']: true,
          ['dark:hover:bg-' + link.color + '-500']: true,
          'rounded-r-none pr-10': link.children && link.children.length
        }"
      >
        <Icon 
          :name="link.icon" 
          :class="{ 
            ['text-' + link.color + '-500']: true,
            ['group-hover:text-gray-900 group-hover:text-opacity-60']: true
          }" /> 
        {{ link.label }}
      </Btn>
    </nuxt-link>
    <template v-if="link.children && link.children.length">
      <Btn 
        class="flex py-0 bg-transparent items-center content-center rounded-l-none icon-button h-8 absolute right-0 top-0 z-10"
        @click="showNested = !showNested"
        >
        <Icon :name="showNested ? 'angle-up' : 'angle-down'" />
      </Btn>
      <Transition name="down-fade">
        <div 
          v-if="showNested"
          class="nested-site-nav-links flex flex-col p-1 space-y-1"
          :class="{'relative top-0': isMobile}">
          <SiteNavLink 
            v-for="child in link.children"
            :key="child.path"
            class="w-full"
            :link="child" />
        </div>
      </Transition>
    </template>
    <div 
      v-if="link.children && link.children.length && !showNested"
      class="absolute inset-0 z-1"
      @click="showNested = true"
      @mouseenter="showNested = true"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import { NavLink } from '~/utils/pages'

  export default Vue.extend({
    props: {
      link: {
        type: Object as () => NavLink,
        default: () => {
          return {
            label: null,
            path: null,
            icon: null,
            color: null,
            children: []
          }
        }
      }
    },
    data() {
      return {
        showNested: false
      }
    },
    computed: {
      ...mapGetters({
        'isMobile': 'screen/isMobile'
      })
    },
    watch: {
      '$route.path'() {
        this.showNested = false
      }
    },
  })
</script>

<style lang="scss" scoped>
.nested-site-nav-links {
  @apply absolute top-9 rounded dark:bg-gray-800 shadow-xl;
}
</style>