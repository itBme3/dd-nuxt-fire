
<template>
  <div :class="{
      'site-nav left-0 top-0 fixed flex justify-space-between z-999999 dark:bg-gray-900 bg-gray-100': true,
      'right-0': isMobile,
      'right-0 w-screen': !isMobile
    }"
    >
    <nuxt-link to="/" class="logo w-12 h-12 p-2">
      <Icon :name="'logoIcon'" class="h-full w-full" />
    </nuxt-link>
    <div v-if="isMobile && !mobileNavCollapsed" @click="mobileNavCollapsed = true"
      :class="{
        'cursor-pointer fixed inset-0 z-99999 bg-opacity-30 dark:bg-opacity-80 bg-gray-900': true,
      }"></div>
    <div :class="{
      'menu flex flex-col ml-auto mr-0': true,
      'absolute left-auto right-0': isMobile
    }">
      <Btn v-if="isMobile"
        class="icon-button mt-2 mr-2 px-3 py-2 ml-auto dark:bg-gray-800 bg-white relative z-999999"
        @click="mobileNavCollapsed = !mobileNavCollapsed">
        <Icon :name="mobileNavCollapsed ? 'menu' : 'close'" />
      </Btn>
      <nav :class="{
        'site-navigation p-1 flex ml-auto mr-0 relative z-999999': true,
        'flex-col space-y-1 max-w-[100px]': isMobile,
        'flex-row flex-nowrap space-x-1': !isMobile,
        'hidden': isMobile && mobileNavCollapsed
        }">
        <nuxt-link
          v-for="page in pages"
          :key="page.path"
          :to="page.path">
          <Btn :class="{
              'text-left justify-start group w-full bg-white dark:bg-opacity-5 text-gray-700 dark:text-gray-300 dark:hover:text-gray-900 hover:text-gray-900 hover:text-opacity-70 dark:hover:text-opacity-70': true,
              ['hover:bg-' + page.color + '-500']: true,
              ['dark:hover:bg-' + page.color + '-500']: true,
            }"
          >
            <Icon 
              :name="page.icon" 
              :class="{ 
                ['text-' + page.color + '-500']: true,
                ['group-hover:text-gray-900 group-hover:text-opacity-60']: true
              }" /> 
              {{ page.label }}
            </Btn>
        </nuxt-link>
      </nav>
    </div>
  </div>
</template>
<script>
import navPages from '~/utils/pages'
export default {

  data() {
    return {
      mobileNavCollapsed: true,
      isMobile: false,
      width: 0,
      height: 0
    }
  },
  computed: {
    pages() {
      const accessPages = Array.isArray(this.$store.state?.auth?.user?.doc?.access?.can_access_pages) ? this.$store.state.auth.user.doc.access.can_access_pages : [];
      const isAdmin = !!this.$store.state?.auth?.user?.doc?.access?.is_admin;
      return isAdmin ? navPages 
        : !accessPages?.length ? [] 
        : navPages.filter(p => accessPages.includes(p.path) || accessPages.includes(`${p.path}/**`))
    }
  },
  watch: {
    '$route.fullPath' () {
      this.mobileNavCollapsed = true
    }
  },
  mounted () {
    this.getDocumentDimensions()
    window.addEventListener('resize', this.getDocumentDimensions)
    window.addEventListener('scroll', this.collapseNav)
  },
  unmounted () {
    window.removeEventListener('resize', this.getDocumentDimensions)
    window.removeEventListener('scroll', this.collapseNav)
  },
  methods: {
    getDocumentDimensions () {
      this.width = document.documentElement.clientWidth
      this.height = document.documentElement.clientHeight
      this.isMobile = this.width < 640
      this.mobileNavCollapsed = true
    }
  }
}
</script>