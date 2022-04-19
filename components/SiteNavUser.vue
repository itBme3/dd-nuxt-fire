<template>
  <div class="site-nav-user"
    :class="{
        'ml-6': !isMobile,
        'p-3': isMobile
      }">
    <v-popover
      ref="userPopover"
      class="flex items-center content-center"
      offset="6"
      placement="bottom-end"
      :disabled="isMobile"
    >

      <Media 
        :is-background="true"
        class="tooltip-target w-8 h-8 rounded-full border-[.15rem] border-gray-100 shadow my-auto"
        :class="{
          'cursor-pointer': !isMobile
        }"
        :media="{src: $store.state.auth.user.doc.avatar}"
      />

      <template v-if="isMobile">
        <small class="ml-2">{{ $store.state.auth.user.email }}</small>
        <UserColorMode />
        <Btn class="mt-3 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70" @click="$store.dispatch('auth/logout')">logout</Btn>
      </template>

      <template slot="popover">
        <small>{{ $store.state.auth.user.email }}</small>
        <UserColorMode />
        <Btn class="mt-2 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70" @click="$store.dispatch('auth/logout')">logout</Btn>
      </template>
    </v-popover>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {mapGetters} from 'vuex'

  export default Vue.extend({
      computed: {
        ...mapGetters({ 
          isMobile: 'screen/isMobile'
        })
      }
  })
</script>

<style scoped>

</style>