<template>
  <div class="max-w-full">
    <!-- <Logo /> -->
    <div>
      <h1>Index</h1>
    </div>
  </div>
</template>

<script lang="js">

export default {
  async asyncData({ app }) {
    // INFO -> app.$fire.firestore etc. are accessible
    const messageRef = app.$fire.firestore.collection('products_live').doc('tailored-fit-dark-wash')
    try {
      const snapshot = await messageRef.get()
      const doc = snapshot.data()
      if (!doc) {
        // console.info('Document does not exist.')
        return
      }
      // console.info(doc.message)
    } catch (e) {
      console.error(e)
    }
  },
  data: () => ({
  })
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
