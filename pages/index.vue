<template>
  <div class="max-w-full">
    <Logo />
    <div v-for="component in exampleComponents" :key="component.__file">
      <hr class="mt-5 mb-5" />
      <component :is="component"></component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/Logo/index.vue'
import Auth from '~/components/examples/Auth.vue'
import Firestore from '~/components/examples/Firestore.vue'
import Functions from '~/components/examples/Functions.vue'
import Storage from '~/components/examples/Storage.vue'
import VuexStore from '~/components/examples/VuexStore.vue'

export default Vue.extend({
  components: {
    Logo,
    Auth,
    Firestore,
    Functions,
    Storage,
    VuexStore
  },
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
    exampleComponents: [
      Auth,
      Firestore,
      Functions,
      Storage,
      VuexStore,
    ],
  }),
})
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
