import initialState from './state'

export default {
  RESET_STORE: (state) => {
    Object.assign(state, initialState())
    if (window !== undefined && window.location.pathname !== '/login') {
        window.location.pathname = '/login'
    }
  },

  SET_AUTH_USER: (state, { authUser, userDoc }) => {
    console.log({ authUser })
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email
    }
    state.userDoc = {
      ...JSON.parse(JSON.stringify(userDoc))
    }
    
  }
}
