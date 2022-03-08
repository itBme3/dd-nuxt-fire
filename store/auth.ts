interface State {
      user: {[key:string]: any} | null
}

export const state = ():State => ({
      user: null
});

export const mutations = {
      reset(state:State) {
            state.user = null;
      },
      setUser(state: State, { authUser, userDoc }: { authUser: any, userDoc: any }) {
            state.user = {
                  uid: authUser.uid,
                  email: authUser.email,
                  doc: JSON.parse(JSON.stringify(userDoc))
            }
      }
}
