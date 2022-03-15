import { asyncDelay } from "~/utils/funcs"

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
      ...initialState
});

export const mutations = {
      resetState(state: State) {
            state.props = Object.assign({}, state.props, initialState.props)
            state.onCancel = initialState.onCancel
            state.onUpdate = initialState.onUpdate
            state.onSubmit = initialState.onSubmit
      },
      open(state: State, params: State) {
            const {
                  props = initialState.props,
                  onUpdate = initialState.onUpdate,
                  onSubmit = initialState.onSubmit,
                  onCancel = initialState.onCancel
            } = params;
            state.props = { ...defaultProps, ...(!props ? {} : props) }
            state.onUpdate = onUpdate
            state.onSubmit = onSubmit
            state.onCancel = onCancel
      },
      // updateSelection(state: State, selection: any[]) {
      //       state.props = Object.assign({}, state.props, initialState.props)
      // }
}