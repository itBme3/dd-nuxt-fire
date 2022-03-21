<template>
  <div 
    :class="{
    'expansion-panel': true,
    'expanded p-4': expanded,
    'p-0': !expanded,
    }">

    <gButton
      class="expansion-panel-title bg-opacity-0 bg-black hover:bg-opacity-20 w-full"
      :class="{
        [titleClasses]: !!titleClasses.length
      }"
      @click="expanded = !expanded; $emit('expanded', expanded)">
      <slot name="title" />
      <Icon :name="expanded ? iconExpanded : icon" />
    </gButton>
    
    <div class="expansion-panel-content transition-all ease-ramp-in"
      :class="{
        [contentClasses]: !!contentClasses.length,
        'hidden': !expanded,
        'animate-fade-in-down': expanded
      }">
      <slot />
    </div>

  </div>
</template>

<script>
export default {
  props: {
    classes: {
      type: Object,
      default: () => {
        return {
          title: '',
          content: '',
        }
      }
    },
    icon: {
      type: String,
      default: 'angle-down'
    },
    iconExpanded: {
      type: String,
      default: 'angle-up'
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expanded: !!this.expand
    }
  },
  computed: {
    titleClasses() {
      return this.classes?.title || ''
    },
    contentClasses() {
      return this.classes?.content || ''
    }
  },
  watch: {
    expand(expanded) {
      this.expanded = expanded
    },
    expanded(expanded) {
      console.log(this.$el)
      setTimeout(() => {
        window.scrollTo({top: this.$el.offsetParent.offsetTop + (expanded ? -300 : 200), left: 0, behavior: 'smooth'})
      }, 250)
    },
  }
}
</script>

<style lang="scss">
.expansion-panel {
  .expansion-panel-title {
    @apply flex items-center justify-between;
    .icon {
      @apply ml-auto mr-0;
    }
  }
  &:not(.expanded) {
    .expansion-panel-title {
      @apply py-3;
    }
  }
}
</style>