<template>
  <div class="site-container overflow-x-hidden inline">
      <SiteNav />
      <main
        class="w-screen max-w-4xl mx-auto py-20 px-4 sm:px-6"
        style="display: block;"
      >
        <Nuxt :key="$route.fullPath" />
      </main>

      <Modals />

    </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  watch: {
    preference (preference) {
      if (this.forced) {
        return
      }
      if (preference === 'dark') {
        this.value = colorMode.getColorScheme()
        this._watchMedia()
      } else {
        this.value = preference
      }

      this._storePreference(preference)
    },
    value (newValue, oldValue) {
      colorMode.removeClass(oldValue)
      colorMode.addClass(newValue)
    }
  },
  created () {
    if (this.preference === 'dark') {
      this._watchMedia()
    }
  },
  mounted () {
    if (window.localStorage) {
      this._watchStorageChange()
    }
  },
  methods: {
    setColorMode() {
      this.$colorMode.preference = this.$colorMode.preference === 'system' ? 'light' : 'system'
    },
     _watchMedia () {
      if (this._darkWatcher || !window.matchMedia) {
        return
      }
      this._darkWatcher = window.matchMedia('(prefers-color-scheme: dark)')
      this._darkWatcher.addListener((e) => {
        if (!this.forced && this.preference === 'system') {
          this.value = colorMode.getColorScheme()
        }
      })
    },
    _watchStorageChange () {
      window.addEventListener('storage', (e) => {
        if (e.key === 'nuxt-color-mode') {
          this.preference = e.newValue
        }
      })
    },
    _storePreference (preference) {
      // Local storage to sync with other tabs
      window.localStorage.setItem('nuxt-color-mode', preference)
    }
  }
})
</script>

<style lang="scss">
.site-container {
  @apply min-h-screen
}
</style>

