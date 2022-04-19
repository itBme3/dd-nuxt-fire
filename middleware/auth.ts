/* eslint-disable no-unused-expressions */
import { Middleware } from '@nuxt/types'
import { NavLink } from '~/utils/pages';

const authMiddleware: Middleware = ({ store, redirect, route }) => {
  const isLoginPage = route.name === 'login'
  if ([undefined, null].includes(store.state.auth?.user?.uid)) {
    if (isLoginPage) { return }
    return redirect('/login')
  }
  const userAccess:NavLink[] = store.getters['auth/userAccessPages']
  const canAccessCurrentPage = route.path === '/' || userAccess.filter((page) => route.path.indexOf(page.path) === 0 ).length
  if ((isLoginPage && ![undefined, null].includes(store.state.auth?.user?.uid)) || !canAccessCurrentPage) {
    return redirect('/')
  }
}

export default authMiddleware
