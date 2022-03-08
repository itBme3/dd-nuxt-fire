// import { ShopEnv } from "~/models/shopify.models";
import { FireDb } from "~/utils/firebase";

// interface StateProduct { title: string, id: number, handle: string, image: any }

// interface StateEnvObj {
//       [key:string]: StateProduct
// }

// interface State {
//       [ShopEnv.DEV]: StateEnvObj;
//       [ShopEnv.LIVE]: StateEnvObj;
//       status: boolean
// }

// export const state = (): State => ({
//       dev: {},
//       live: {},
//       status: false
// })


let db;

export const state = () => ({
      dev: {},
      live: {},
      status: false
})

export const mutations = {
      set (state, { env, product }) {
            if (product?.handle) {
                  const { title, handle, id, images } = product;
                  const image = Array.isArray(images) ? images[0] : { url: product?.image };
                  const cached = state[env][handle] || {};
                  if (
                        title === cached.title
                        && handle === cached.handle
                        && id === cached.id
                        && image?.url === cached?.image?.url
                  ) {
                        console.log('already cached');
                  } else {
                        console.log('stored product')
                        // state[env] = {};
                        // setTimeout(() => {
                        state[env] = {...JSON.parse(JSON.stringify(state[env])), [handle]: { title, handle, id, image }};
                        // state.productsCache[env][handle] = { title, handle, id, image };
                        // }, 500)
                  }
            }
      }
}

export const actions = {
      async getProduct ({state, commit}, { handle, env }) {
            if (state[env][handle]?.handle) {
                  return state[env][handle]
            }
            if (db === undefined) {
                  db = new FireDb({ $fire: this.$fire });
            }
            const product = await db.doc(`products_${env}/${handle}`)
                  .then((doc) => {
                        if (doc?.handle) {
                              return {
                                    title: doc.title,
                                    id: doc.id,
                                    handle: doc.handle,
                                    image: doc.images[0]
                              }
                        }
                        return null
                  }).catch(console.error);
            if (!product?.handle) {
                  return null
            }
            commit('set', { product, env });
            return product
      }
}