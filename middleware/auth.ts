/* eslint-disable no-unused-expressions */
import { Middleware } from '@nuxt/types'

const testMiddleware: Middleware = ({ store, redirect, route }) => {
  store.state.authUser != null && route.path === '/login' ? redirect('/') : ''
  store.state.authUser == null && route.path !== '/login' ? redirect('/login') : ''
  
}

export default testMiddleware
