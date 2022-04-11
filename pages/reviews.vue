<template>
  <div class="page-content reviews">
    <Title>Reviews:</Title>
    <AlgoliaSearch :index-name="'reviews'" :selecting="false" />
  </div>
</template>
