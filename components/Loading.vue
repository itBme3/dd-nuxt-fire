<template>
  <div class="loader">
    <div class="bounce1"
      :class="{ [classes]: typeof classes === 'string' && classes.length }"></div>
    <div class="bounce2"
      :class="{ [classes]: typeof classes === 'string' && classes.length }"></div>
    <div class="bounce3"
      :class="{ [classes]: typeof classes === 'string' && classes.length }"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default Vue.extend({
  props: {
    classes: {
      type: String,
      default: 'bg-gray-300 dark:bg-gray-700'
    }
  }
})
</script>

<style lang="scss" scoped>
.loader {
  margin: auto;
  width: auto;
  text-align: center;
  > div {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: loader-bounce 1s infinite ease-in-out both;
    animation: loader-bounce 1s infinite ease-in-out both;
  }
  .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
}

@-webkit-keyframes loader-bounce {
  0%, 80%, 100% { 
    -webkit-transform: scale(0.6r);
    opacity: .05;
  }
  40% { 
    -webkit-transform: scale(1.0);
    opacity: 1;
  }
}

@keyframes loader-bounce {
  0%, 80%, 100% { 
    -webkit-transform: scale(0.6);
    transform: scale(0.6);
    opacity: .05;
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
    opacity: 1;
  }
}
</style>