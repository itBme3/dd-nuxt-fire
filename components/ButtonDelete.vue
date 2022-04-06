<template>
  <div class="button-delete flex items-center content-end transition-all ease-quick-in">
    <gButton 
      v-if="confirming"
      class="bg-red-500 text-red-900 hover:bg-red-600 text-xs mr-2"
      :class="{
        [classes.confirmButton]: true
      }"
      @click="$emit('delete', true)">
      {{ confirmText }}
    </gButton>
    <gButton 
      v-tooltip="{content: confirming ? 'Cancel' : tooltipText, placement: confirming ? 'top-end' : 'top', offset: '5px' }"
      tabindex="-1"
      class="icon-button rounded-full text-gray-500 bg-gray-200 dark:bg-gray-600 dark:text-gray-900 shadow-xl"
      :class="{
        'hover:text-red-900 dark:hover:text-red-900 dark:hover:bg-red-500 hover:bg-red-500': !confirming,
        [classes.button]: true
      }"
      @click="confirming = !confirming">
      <Icon :name="confirming ? 'close' : 'trashcan'" class="relative top-px" />
    </gButton>
  </div>
</template>

<script>
export default {
  props: {
    tabindex: {
      type: String,
      default: '-1'
    },
    confirmText: {
      type: String,
      default: 'Confirm Delete'
    },
    tooltipText: {
      type: String,
      default: 'Delete This'
    },
    classes: {
      type: Object,
      default: () => {
        return {
          button: '',
          tooltip: '',
          confirmButton: ''
        }
      }
    }
  },
  data() {
    return {
      confirming: false
    }
  }
}
</script>

<style lang="scss">
.button-delete .icon-button {
  @apply w-8 h-8 flex items-center content-center;
}
// .tooltip
.tooltip-inner {
  @apply bg-red-400 text-red-900;
}
</style>