import Vue from 'vue'

interface State {
      props: { [key: string]: any },
      onUpdate: { (selection:any):any },
      onSubmit: { (selection:any):any },
      onCancel: { (initial:any):any },
}
const defaultProps = {
      indexName: null,
      searchQuery: '',
      filtering: true,
      constantFilters: [], 
      filterValues: { filters: [] },
      selecting: { 
            hideSelected: true,
            quick: false,
            multiple: true,
            identifier: 'id',
            hideSideNav: false,
      },
      selectedValues: [],
      cardStyle: 'media-above',
      classes: {
            grid: '',
            hit: '',
            card: '',
            title: '',
            content: '',
            media: '',
      }
}
const initialState: State = {
      props: defaultProps,
      onUpdate(e) { 
            return e
      },
      onSubmit(e) { 
            return e
      },
      onCancel(e) { 
            return e
      },
}

export const state = ():State => ({
      ...JSON.parse(JSON.stringify(initialState))
});

export const mutations = {
      resetState(state: State) {
            state.props = Object.assign({}, state.props, JSON.parse(JSON.stringify(initialState.props)))
            console.log({ state })
            Vue.set(state, 'onCancel',  initialState.onCancel)
            Vue.set(state, 'onUpdate',  initialState.onUpdate)
            Vue.set(state, 'onSubmit',  initialState.onSubmit)
      },
      open(state: State, params: State) {
            const {
                  props = initialState.props,
                  onUpdate = initialState.onUpdate,
                  onSubmit = initialState.onSubmit,
                  onCancel = initialState.onCancel
            } = params;
            state.props =  Object.assign({ }, state.props, { ...defaultProps, ...(!props ? {} : props) })
            Vue.set(state, 'onCancel',  onCancel)
            Vue.set(state, 'onUpdate',  onUpdate)
            Vue.set(state, 'onSubmit', onSubmit)
      }
}