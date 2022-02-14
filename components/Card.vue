<template>
  <div class="card">
    <slot name="before" />
    <div class="card-media">
      <slot name="media" />
    </div>
    <div class="card-content">
      <slot />
    </div>
    <slot name="after" />
  </div>
</template>

<script>
export default {
  
}
</script>

