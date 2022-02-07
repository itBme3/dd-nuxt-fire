export default {
  async nuxtServerInit({ dispatch }, ctx) {
    // INFO -> Nuxt-fire Objects can be accessed in nuxtServerInit action via this.$fire___, ctx.$fire___ and ctx.app.$fire___'

    /** Get the VERIFIED authUser on the server */
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user

      console.info(
        'Auth User verified on server-side. User: ',
        authUser,
        'Claims:',
        claims
      )

      await dispatch('onAuthStateChanged', {
        authUser,
        claims,
      })
    }
  },

  async onAuthStateChanged ({ commit }, { authUser }) {
    let userDoc = null;
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    if (authUser && authUser.getIdToken) {
      try {
        await authUser.getIdToken(true)
        const userDocRef = this.$fire.firestore.collection('users').doc(authUser.uid);
        const userAccessDocRef = this.$fire.firestore.collection('user_access').doc(authUser.uid);
        userDoc = await userDocRef.get().then(res => { return { id: res.id, ...res.data() }});
        userDoc.access = await userAccessDocRef.get().then(res => { return { id: res.id, ...res.data() }});
        if (this.$router.currentRoute.fullPath === '/login') {
          this.$router.go('/')
        }
      } catch (e) {
        console.error(e)
      }
    }
    commit('SET_AUTH_USER', { authUser, userDoc })
  },

  checkVuexStore(ctx) {
    if (this.$fire.auth === null) {
      throw 'Vuex Store example not working - this.$fire.auth cannot be accessed.'
    }

    alert(
      'Success. Nuxt-fire Objects can be accessed in store actions via this.$fire___'
    )
  },
}
