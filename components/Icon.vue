<template>
  <i :class="{ 'gicon': true, ['gicon-' + name]: true }" />
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: 'plus'
    }
  }
}
</script>