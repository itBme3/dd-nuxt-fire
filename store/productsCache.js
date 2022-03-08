import { FireDb } from "~/utils/firebase";

let db;

export const state = () => ({
      dev: {},
      live: {},
      status: false
})

export const mutations = {
      set (state, { env, products }) {
            try {
                  const newProducts = products.filter(product => {
                        if (!product?.handle) { return false }
                              const cached = state[env][product.handle] || {};
                              return product.title !== cached.title
                                    || product.handle !== cached.handle
                                    || product.id !== cached.id
                                    || product.images[0]?.url !== cached?.images[0]?.url
                  }).reduce((acc, product) => {
                        const { title, handle, id, images } = product;
                        const image = Array.isArray(images) ? images[0] : { url: product?.image };
                        return { ...acc, [handle]: { title, id, image } }
                  }, {})
                  state[env] = { ...JSON.parse(JSON.stringify(state[env])), ...newProducts };
            }  catch(err) {}
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
            commit('set', { products: [product], env });
            return product
      }
}