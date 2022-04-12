<template>
  <div class="w-[calc(100%-2em)] mx-auto my-5 max-w-md">
    <SubTitle title="SignUp / LogIn" />
    <template v-if="!isLoggedIn">
      <Btn @click="googleSignIn">Sign In With Google</Btn>
      <Btn class="bg-gray-800 bg-opacity-50 text-blue-500 text-xs hover:text-white hover:border-blue-500 hover:bg-blue-500 float-right" @click="creatingUser = !creatingUser">{{ creatingUser ? 'Sign In' : 'New Here?'}}</Btn>
      <!-- <h4 class="mt-4 mb-2">Sign In With Email:</h4> -->
      <form onsubmit="return false;"
        class="rounded border border-gray-700 p-6">
        <div v-if="creatingUser"
          class="mb-4">
          <label class="inline-block text-gray-700 text-sm font-bold mb-2" for="displayName">
            Display Name
          </label>
          <gInput
            v-model="formData.displayName"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Do Jane"
            type="text"
            autocomplete="off"
          />
        </div>
        <div class="mb-4">
          <template v-if="(resettingPassword && !resetPasswordEmailSent) || !resettingPassword">
            <label class="inline-block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <Btn 
              class="bg-gray-800 bg-opacity-50 text-blue-500 text-xs hover:text-white hover:border-blue-500 hover:bg-blue-500 float-right mb-2"
              @click="resettingPassword = !resettingPassword"
              >{{  resettingPassword ? 'Sign In' : 'Reset Password' }}</Btn>
            <gInput
              v-model="formData.email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email"
              type="email"
              autocomplete="username"
            />
          </template>
          <h4 v-else class="text-green-500">Email sent to <strong>{{ formData.email }}</strong></h4>
        </div>
        <div v-if="!resettingPassword" class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Password
          </label>
          
          <gInput
            v-model="formData.password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Password"
            type="password"
            autocomplete="current-password"
          />
        </div>
        <Btn v-if="!!creatingUser" @click="createUser">Sign Up</Btn>
        <Btn v-if="!!resettingPassword" @click="resetPassword">{{ resetPasswordEmailSent ? 'Sign In' : 'Reset Password'}}</Btn>
        <Btn v-if="!!!creatingUser && !!!resettingPassword" @click="signInUser">Sign In</Btn>
      </form>
    </template>
    <div v-else>
      <p>You are logged in with {{ authUser.email }}.</p>
      <Btn color="primary" outlined @click="logout">Logout</Btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
      resettingPassword: false,
      resetPasswordEmailSent: false,
      creatingUser: false
    }
  },
  computed: {
    ...mapState({
      authUser: (state: any) => state.auth.user,
    }),
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  // fetch() {
  //   // INFO -> this.$fire.auth user etc. are accessible
  //   // INFO -> this.$store.state.authUser is accessible even on server-side
  // },
  methods: {
    async googleSignIn() {
      try {
        const provider = new this.$fireModule.auth.GoogleAuthProvider();
        await this.$fire.auth.signInWithPopup(provider)
          .then(() => {window.location.href = '/'})
      } catch(e) {
        alert(e)
      }
    },
    async createUser() {
      try {
        await this.$fire.auth.createUserWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        ).then(() => {window.location.href = '/'})
      } catch (e) {
        alert(e)
      }
    },
    async signInUser() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.formData.email,
          this.formData.password
        ).then(() => {window.location.href = '/'})
      } catch (e) {
        alert(e)
      }
    },
    async resetPassword() {
      if(this.resetPasswordEmailSent) {
        this.resettingPassword = false;
        this.resetPasswordEmailSent = false;
        return
      }
      try {
        await this.$fire.auth.sendPasswordResetEmail(this.formData.email)
        this.resetPasswordEmailSent = true
      } catch (e) {
        alert(e)
      }
    },
    async logout() {
      try {
        await this.$fire.auth.signOut()
      } catch (e) {
        alert(e)
      }
    },
  },
})
</script>
