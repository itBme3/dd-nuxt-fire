import Vue from "vue"

interface State {
      screen: {
            width: number | null;
            height: number | null;
      }
}

export const state = ():State  => ({
      screen: {
            width: null,
            height: null,
      }
})

export const mutations = {
      setDimensions(state: State, screen: { height: number; width: number }) {
            Vue.set(state, 'screen', screen)
      }
}

export const getters = {
      isMobile(state:State) {
            return typeof state.screen.width === 'number' && state.screen.width < 640
      },
      width(state: State) {
            return state.screen.width
      },
      height(state: State) {
            return state.screen.height
      }
}
