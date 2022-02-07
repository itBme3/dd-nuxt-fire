<template>
  <button class="button"
    :class="{
      'opacity-50': disabled || loading,
      'cursor-not-allowed': disabled,
      'cursor-wait': loading,
    }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot v-if="!loading" />
    <div v-else>Loading...</div>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped></style>
