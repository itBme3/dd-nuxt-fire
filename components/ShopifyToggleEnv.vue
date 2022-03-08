<template>
  <div
    class="toggle-shop-env buttons float-right flex text-xs nowrap items-center justify-end py-2 space-x-2">
      <gButton  
        v-for="anEnv in envs"
        :key="anEnv"
        :class="{
          ['hover:bg-green-500 border uppercase']: true,
          ['bg-green-500 border-green-500 border-opacity-100 text-gray-900 text-opacity-80']: shopEnv === anEnv,
          ['bg-transparent border-gray-800 dark:border-gray-700 text-gray-900 hover:text-green-900 dark:text-gray-100 dark:hover:text-green-900 hover:border-green-500 dark:hover:border-green-500']: shopEnv !== anEnv,
        }"
        @click="(e) => $emit('change', anEnv)">{{ anEnv }}</gButton>
  </div>
</template>

<script>
export default {
  props: {
    env: {
      type: String,
      default: 'live'
    }
  },
  data() {
    return {
      envs: ['dev', 'live'],
      shopEnv: this.env
    }
  },
  watch: {
    env() {
      this.shopEnv = this.env
    }
  }
}
</script>