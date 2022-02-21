<template>
  <i v-if="iconName !== 'logoIcon'" 
    :class="{ 'gicon': true, ['gicon-' + iconName]: true }"
    @click="(e) => $emit('click', e)" />
  <svg v-else
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73.99 88.92"
    @click="(e) => $emit('click', e)"><defs><style>.a{fill:#ee383a;}</style></defs><path class="a" d="M37.25.18,46.5,28.6a.27.27,0,0,0,.3.18l26.88-5.66a.26.26,0,0,1,.24.43L54.33,44.28a.24.24,0,0,0,0,.35L73.92,65.4a.26.26,0,0,1-.24.43L46.8,60.17a.26.26,0,0,0-.3.17l-9.25,28.4a.26.26,0,0,1-.49,0L27.5,60.34a.26.26,0,0,0-.3-.17L.31,65.83a.26.26,0,0,1-.24-.43l19.6-20.77a.24.24,0,0,0,0-.35L.07,23.55a.26.26,0,0,1,.24-.43L27.2,28.78a.27.27,0,0,0,.3-.18L36.76.18A.26.26,0,0,1,37.25.18Z"/></svg>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: 'plus'
    }
  },
  computed: {
    iconName() {
      return this.name
    }
  }
}
</script>