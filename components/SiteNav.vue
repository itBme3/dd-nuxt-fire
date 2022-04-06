
<template>
  <div :class="{
      'site-nav left-0 top-0 fixed flex transition-all ease-quick-in justify-space-between z-nav dark:bg-gray-900 bg-gray-100': true,
      'right-0': isMobile,
      'right-0 w-screen p-2': !isMobile
    }"
    >
    <nuxt-link to="/" class="logo w-12 h-12 p-2">
      <Icon :name="'logoIcon'" class="h-full w-full" />
    </nuxt-link>
    <div v-if="isMobile && !mobileNavCollapsed" :class="{
        'cursor-pointer fixed inset-0 z-99999 bg-opacity-30 dark:bg-opacity-80 bg-gray-900': true,
      }"
      @click="mobileNavCollapsed = true"></div>
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
        'flex-col space-y-1 max-w-[200px] shadow-xl rounded bg-white dark:bg-gray-900': isMobile,
        'flex-row flex-nowrap space-x-1': !isMobile,
        'hidden': isMobile && mobileNavCollapsed
        }">
        <SiteNavLink
          v-for="page in pages"
          :key="page.path"
          :link="page" 
        />
      </nav>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import navPages from '~/utils/pages'
export default Vue.extend({

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
      this.$store.commit('screen/setDimensions', { width: this.width, height: this.height })
    }
  }
})
</script>

<style lang="scss">
  body.modal-active {
    .site-nav {
      @apply -top-48 #{!important};
    }
  }
</style>