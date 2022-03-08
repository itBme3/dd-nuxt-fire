/* eslint-disable no-unused-expressions */
import { Middleware } from '@nuxt/types'

const testMiddleware: Middleware = ({ store, redirect, route }) => {
  store.state.auth?.user != null && route.path === '/login' ? redirect('/') : ''
  store.state.auth?.user == null && route.path !== '/login' ? redirect('/login') : ''
}

export default testMiddleware
