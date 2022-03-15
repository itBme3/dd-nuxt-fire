import { ShopEnv } from "~/models/shopify.models";



interface StateEnv {
      product: { [key: string]: any } | null;
      metafields: { [key: string]: any } | null;
      initial: { 
            product: { [key: string]: any } | null;
            metafields: { [key: string]: any } | null;
       }
}
interface State {
      [ShopEnv.LIVE]: StateEnv,
      [ShopEnv.DEV]: StateEnv,
}

const initialState:State = {
      [ShopEnv.LIVE]: {
            product: null, metafields: {},
            initial: { product: null, metafields: {} }
      },
      [ShopEnv.DEV]: {
            product: null, metafields: {},
            initial: { product: null, metafields: {} }
      }
}

export const state = ():State => ({
      ...initialState
});

export const mutations = {
      resetState(state: State) {
            state = Object.assign(initialState)
            return state
      },
      setProduct(state:State, { env, product}: { env: ShopEnv, product?: any }) {
            state[env].product = product
            if (product === null) {
                  state[env].initial.product = null
            }  else if (state[env]?.product?.handle !== state[env]?.initial?.product?.handle) {
                  state[env].initial.product = product
            }
      },
      setMetafield(state: State, { env, metafield }: { env: ShopEnv, metafield?: any }) {
            if ([undefined, null].includes(metafield)) {
                  state[env].metafields = {}
                  state[env].initial.metafields = {}
            } else {
                  const keyPath = `${metafield.namespace}.${metafield.key}`
                  const metafields:any = state[env].metafields === null ? {} : state[env].metafields
                  metafields[keyPath] = metafield
                  const initialMetafields:any = !state[env]?.initial?.metafields ? state[env]?.initial?.metafields : {}
                  if (!initialMetafields[keyPath] || initialMetafields[keyPath].docPath !== metafield.docPath) {
                        initialMetafields[keyPath] = metafield
                  }
                  state[env].metafields = metafields
                  state[env].initial.metafields = initialMetafields
            }
      },
      setEnvState(state: State, val: { env: ShopEnv, product?: any; metafields?: any; initial?: any; merge?: boolean }) {
            const { env } = val;
            const merge = !!val?.merge;
            const metafields = val?.metafields === undefined
                  ? merge ? state[env]?.metafields || {} : {}
                  : val.metafields;
            const product = val?.product === undefined
                  ? merge ? state[env]?.product || null : null
                  : val.product;
            const initial = {
                  product: product?.handle && state[env]?.initial?.product?.handle && product?.handle === state[env]?.initial?.product?.handle ?     
                        state[env]?.initial?.product
                        : product,
                  metafields: merge && state[env].metafields !== null ? { ...state[env].metafields, ...metafields } : metafields === undefined ? null : metafields
            };
            state[env] = { product, metafields, initial }
      }
      
}

export const actions:any = {
      async getProduct({ state, commit }: any, { handle, env }: { handle: string, env: ShopEnv }) {
            const otherEnv: ShopEnv = env === ShopEnv.LIVE ? ShopEnv.DEV : ShopEnv.LIVE;
            if (!state[env]) {
                  commit('resetState')
                  return null
            }
            if (!state[otherEnv] || state[otherEnv]?.product?.handle !== handle) {
                  commit('setEnvState', { env: otherEnv, product: null, metafields: null, initial: {product: null, metafields: null} })
            }

            if (state[env]?.product?.handle === handle) {
                  return state[env]?.product
            }

            const product = await this.$shops[env].get({ 
                        path: '/products', 
                        query: { 
                        fields: 'id,title,body_html,product_type,handle,status,tags,images',
                        handle,
                        limit: 1
                  } })
                        .then((res:any) => res.data?.body?.products[0])
                        .catch((err:any) => {
                              return { ERROR: err.message }
                        })
            const res = {
                  env,
                  product,
                  metafields: Object.assign({}),
                  initial: {
                        product,
                        metafields: Object.assign({}),
                  }
            }
            commit('setEnvState', res);
            return res
      },
      async getMetafield({ state, commit }:any, { env, handle, namespace, key }: { env: ShopEnv, handle:string, namespace: string, key: string }) {
            const keyPath = `${namespace}.${key}`;
            if (state[env] && state[env]?.metafields && ![undefined, null].includes(state[env]?.metafields[keyPath])) {
                  return state[env].metafields[keyPath]
            }

            const firebaseDocPaths: { [key:string]: string } = {
                  'studio.product_details': `products_${env}/${handle}/metafields/product_details`,
                  'studio.featuredReviews': `products_${env}/${handle}/metafields/featured_reviews`,
                  'studio.the_look': `products_${env}/${handle}/metafields/the_look`
            }

            if (Object.keys(firebaseDocPaths).includes(keyPath)) {
                  
                  const docPath = firebaseDocPaths[keyPath];
                  const data = await this.$db.doc(docPath).then((res: any) => {
                        if (res?.key) { return res }
                        return {
                              key,
                              namespace,
                              value: false,
                              docId: docPath.split('/').pop(),
                              docPath
                        }
                  });
                  const metafields = { ...(state[env]?.metafields || {}), [keyPath]: data }
                  commit("setEnvState", {
                        env,
                        product: state[env]?.product?.handle !== handle ? null : state[env].product,
                        metafields,
                        initial: {
                              product: state[env]?.product?.handle !== handle ? null : state[env].initial.product,
                              metafields: metafields[keyPath]?.docPath === (state[env]?.metafields && state[env]?.metafields[keyPath] ? state[env]?.metafields[keyPath]?.docPath : null) ? state[env].metafields : metafields,
                        }
                  });
                  return data
            }

      }
}