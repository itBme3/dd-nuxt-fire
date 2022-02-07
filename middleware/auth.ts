/* eslint-disable no-unused-expressions */
import { Middleware } from '@nuxt/types'

const testMiddleware: Middleware = ({ store, redirect, route }) => {
  // if (app.$fire.auth) {
  //   console.log(store.state.authUser)
  // }
  console.log(store.state.userDoc)
  store.state.authUser != null && route.path === '/login' ? redirect('/') : ''
  store.state.authUser == null && route.path !== '/login' ? redirect('/login') : ''
  
}

export default testMiddleware
