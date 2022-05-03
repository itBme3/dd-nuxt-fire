<template>
  <div class="user page flex flex-col content-center">
    <UserCard 
      class="w-auto mt-8"
      :docs="{user: userDoc, access: accessDoc}"
      @accessDoc="(e) => accessDoc = e" />
    <nuxt-link to="/users"
      class="p-2 bg-gray-300 bg-opacity-5 hover:bg-opacity-10 hover:scale-100 hover:shadow-lg  mt-20 inline-block uppercase text-sm mx-auto rounded transform scale-97">
      <Icon name="arrow-left" class="top-px relative transform scale-90 mr-1" /> Users
    </nuxt-link>
  </div>
</template>

<script>
  import Vue from 'vue'
  
  export default Vue.extend({

    async asyncData({$db, route}) {
        const userDoc = await $db.doc(`users/${route.params.uid}`)
        const accessDoc = await $db.doc(`user_access/${route.params.uid}`)
        return { userDoc, accessDoc }
    },
    
    watch: {
      '$route.params.uid'() {
        this.userDoc = {}
        this.accessDoc = {}
        setTimeout(() => {
          this.getUser().catch(console.error)
        }, 500)
      }
    },
    methods: {
      async getUser() {
        if(!this.uid) {
          this.userDoc = {}
          this.accessDoc = {}
          return this.$router.push('/users')
        }
        this.userDoc = await this.$db.doc(`users/${this.uid}`)
        this.accessDoc = await this.$db.doc(`user_access/${this.uid}`)
        if (!this.userDoc?.uid || !this.accessDoc?.uid) {
          return this.$router.push('/users')
        }
        return this.userDoc
      }
    }
  })
</script>

<style scoped>

</style>