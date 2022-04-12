<template>
  <div class="max-w-2xl mx-auto home-page flex flex-col sm:flex-row">
    
    <UserActive 
      card-style="media-above" 
      class="max-w-[280px] shadow-none !bg-transparent"
      :card-classes="{
        content: '!px-0'
      }" 
      />

    <template v-if="pages.length">
      <div class="homepage-links flex flex-wrap p-4">
        <div
          v-for="page in pages"
          :key="page.path"
          class="homepage-link w-full flex flex-col">
          <Btn 
            class="m-1 py-3"
            :class="{
              ['text-' + page.color + '-400 hover:text-' + page.color + '-900 dark:hover:bg-' + page.color + '-400 hover:bg-' + page.color + '-400 bg-white dark:bg-gray-800 hover:bg-' + page.color + '-400 dark:hover:bg-' + page.color + '-400']: true
            }"
            @click="$router.push(page.path)">
            {{ page.label }}
          </Btn>
          <div v-if="page.children && page.children.length"
            class="home-links-nested flex flex-wrap content-stretch items-start mx-1 mb-1">
            <Btn 
              v-for="(childPage, ii) in page.children"
              :key="childPage.path"
              class="flex-grow"
              :class="{
                'mr-1': ii %2 === 0,
                ['text-' + page.color + '-400 hover:text-' + page.color + '-900 dark:hover:bg-' + page.color + '-400 hover:bg-' + page.color + '-400 bg-white dark:bg-gray-800 hover:bg-' + page.color + '-400 dark:hover:bg-' + page.color + '-400']: true
              }"
              @click="$router.push(childPage.path)">
              {{ childPage.label }}
            </Btn>
          </div>
        </div>
      </div>
    </template>
    <div v-else>
      <p class="mt-6 mb-3 text-red-400">You do not currently have access to any pages.</p>
      <small class="text-gray-500">If you think this is a mistake, try refreshing page.</small>
    </div>

  </div>
</template>

<script>

import Vue from 'vue'
import {mapGetters} from 'vuex'

export default Vue.extend({

  computed: {
    ...mapGetters({
      pages: 'auth/userAccessPages'
    })
    
  }
})
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
