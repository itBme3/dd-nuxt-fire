/* eslint-disable camelcase */
interface StateDoc {
      chart?: string;
      columns?: { field: string; headerName: string }[];
      docId?: string;
      docPath?: string;
      image?: string;
      rows?: { [key: string]: any }[];
      updated_at?: number;
      created_at?: number;
}
interface State {
      doc: StateDoc | null;
}

const initialState:State = {
      doc: null
}

export const state = (): State => ({
      ...JSON.parse(JSON.stringify(initialState))
})

export const mutations: any = {

      resetState(state: State) {
            state.doc = Object.assign({}, state.doc, initialState.doc)
      },

      setDoc(state: State, params: {doc: StateDoc; merge?:boolean}) {
            const { doc = null, merge = true } = params;
            const newDoc = merge ? { ...state.doc, ...doc } : doc;
            state.doc = Object.assign({}, state.doc, newDoc)
      }

}

export const actions:any = {
      async getDoc({ commit, state }:any, params: {docId:string, force?:boolean}) {
            const { docId = null, force = false } = params;
            if (!force && state?.doc?.docId === docId) {
                  return state.doc
            }
            const doc = !force && state?.doc?.docId === docId
                  ? state.doc
                  : await this.$db.doc(`size_charts/${docId}`)
                        .then((res: any) => res?.docId === docId ? res : null)
                        .catch((err: any) => alert(err));
            commit('setDoc', { doc, merge: false })
            return doc
      }
}