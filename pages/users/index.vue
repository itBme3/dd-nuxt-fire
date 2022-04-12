<template>
  <div class="users max-w-sm mx-auto flex flex-col items-start space-y-2">
    <template v-if="users.length">
      <div class="relative w-full">
        <gInput 
          ref="searchInput"
          placeholder="search users..."
          v-model="query"
          type="search"
        />
        <gButton 
          class="p-0 transform absolute top-1/2 -translate-y-1/2 right-3 bg-transparent"
          @click="() => {
            query.length ? query = '' : ''
            $refs.searchInput.focus()
          }"
          >
          <Icon 
            :name="query.length ? 'close' : 'search'" />
        </gButton>
      </div>
      <nuxt-link
        v-for="user in visibleUsers"
        :key="user.uid"
        :to="'/users/' + user.uid"
        class="p-6 rounded bg-gray-300 bg-opacity-5 hover:bg-opacity-10 hover:shadow-lg w-full"
        >
        <UserCard 
          class="w-full"
          :docs="{user: user}"
        />
      </nuxt-link>
    </template>
    <Loading v-else />
  </div>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    data() {
      return {
        users: [],
        query: ''
      }
    },
    computed: {
      visibleUsers() {
        return this.users?.filter(user => 
          this.query === '' 
            || this.query.toLowerCase().split(' ')
                .filter(word => 
                  `${user.name.toLowerCase()} ${user.uid.toLowerCase()} ${user.email.toLowerCase()}`
                    .includes(word)
                ).length === this.query.split(' ').length
        )
      }
    },
    mounted() {
      this.getUsers().catch(console.error)
    },
    methods: {
      async getUsers() {
        this.users = await this.$db.collection('users')
      }
    },
  })
</script>

<style scoped>

</style>