<template>
  <div class="site-container overflow-x-hidden">
      <main
        class="w-screen transform sm:translate-x-[45px] sm:w-[calc(100vw-90px)] mx-auto"
        style="display: block;"
      >
        <Nuxt :key="$route.fullPath" />
      </main>
    </div>
</template>

<script>
export default {}
</script>