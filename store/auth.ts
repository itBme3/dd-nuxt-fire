import Vue from 'vue'
import pages, { NavLink } from '~/utils/pages'
import { defaultAvatar } from '~/utils/users';

interface State {
      user: {[key:string]: any}
}

export const state = ():State => ({
      user: {}
});

export const mutations = {
      reset(state:State) {
            state.user = Object.assign({}, state.user, {});
      },
      setUser(state: State, { authUser, userDoc }: { authUser: any, userDoc: any }) {
            if (!userDoc?.avatar?.length) {
                  userDoc.avatar = defaultAvatar(userDoc.uid)
            }
            state.user = {
                  uid: authUser.uid,
                  email: authUser.email,
                  doc: JSON.parse(JSON.stringify(userDoc))
            }
      },
      setUserName(state: State, name: string) {
            Vue.set(state.user, 'name', name)
      },
      setUserImage(state: State, avatar: string) {
            Vue.set(state.user, 'avatar', avatar)
      }
}
export const actions:any = {

      updateUserName({ commit, state }: { commit: Function, state: State }, name: string) {
            if ([undefined, null].includes(state.user?.uid)) {
                  return
            }
            this.$db.updateAt(`users/${state.user.uid}`, { name })
                  .then(() => commit('setUserName', name))
                  .catch((err:any) => {throw new Error(err)})
      },

      async logout() {
            try {
                  await this.$fire.auth.signOut()
                  window.location.href = '/login'
            } catch (e) {
                  alert(e)
            }
      }

}
export const getters = {
      userAccess(state: State):string[] {
            const accessTypes = ['products','images','reviews']
            const accessPages = state?.user?.doc?.access?.can_access_pages || []
            const userRole = state?.user?.doc?.access?.role || 'user'
            const isAdmin = !!state?.user?.doc?.access?.is_admin || userRole === 'admin'
            if (isAdmin) {
                  return [...accessTypes, 'users']
            }
            if (userRole !== 'editor') {
                  return []
            }
            return accessTypes.filter(accessType => accessPages.map((path: string) => path.split('/')[1]).includes(accessType))
      },
      userAccessPages(state: State):NavLink[] {
            const accessTypes = ['products','images','reviews']
            const accessPages = state?.user?.doc?.access?.can_access_pages || []
            const userRole = state?.user?.doc?.access?.role || 'user'
            const isAdmin = !!state?.user?.doc?.access?.is_admin || userRole === 'admin'
            if (isAdmin) {
                  return pages
            }
            if (userRole !== 'editor') {
                  return []
            }
            const userAccess = accessTypes.filter(accessType => accessPages.map((path: string) => path.split('/')[1]).includes(accessType))
            return pages.filter(page => userAccess.includes(page.path.split('/')[1]))
      }
 }