import { ShopEnv } from "~/models/shopify.models";
import { objectsAreTheSame } from "~/utils/funcs";


enum ProductChangeFields {
      IMAGES = 'images',
}

enum MetafieldChangeKeys {
      PRODUCT_DETAILS = 'product_details',
      THE_LOOK = 'the_look',
      FEATURED_REVIEWS = 'featuredReviews',
      FILTERS = 'filters',
}
interface StateEnv {
      product: { [key: string]: any } | null;
      metafields: { [key: string]: any } | null;
      initial: { 
            product: { [key: string]: any } | null;
            metafields: { [key: string]: any } | null;
       }
       changes: {product: ProductChangeFields[], metafields: MetafieldChangeKeys[]}
}
interface State {
      [ShopEnv.LIVE]: StateEnv;
      [ShopEnv.DEV]: StateEnv;
      saving: {
            from: ShopEnv | null;
            to: ShopEnv[] | null;
      }
}

const initialState:State = {
      [ShopEnv.LIVE]: {
            product: null, metafields: {},
            initial: { product: null, metafields: {} },
            changes: {product: [], metafields: []}
      },
      [ShopEnv.DEV]: {
            product: null, metafields: {},
            initial: { product: null, metafields: {} },
            changes: {product: [], metafields: []}
      },
      saving: {
            from: null,
            to: null
      }
}

export const state = ():State => ({
      ...JSON.parse(JSON.stringify(initialState))
});

export const mutations = {
      resetState(state: State) {
            state = Object.assign({}, state, initialState)
            return state
      },
      setState(state: State, newState:State) {
            state.live = Object.assign({}, state.live, newState.live)
            state.dev = Object.assign({}, state.dev, newState.dev)
            state.saving = Object.assign({}, state.saving, newState.saving)
      },
      setProduct(state:State, { env, product}: { env: ShopEnv, product?: any }) {
            state[env].product = Object.assign({}, state[env].product, product)
            if (product === null) {
                  state[env].initial.product = Object.assign({}, state[env].initial.product, null)
            }  else if (state[env]?.product?.handle !== state[env]?.initial?.product?.handle) {
                  state[env].initial.product = Object.assign({}, state[env].initial.product, product)
            }
      },
      setMetafield(state: State, { env, metafield, initial }: { env: ShopEnv, metafield?: any, initial?: boolean }) {
            if ([undefined, null].includes(metafield)) {
                  state[env].metafields = Object.assign({}, state[env].metafields, {})
                  state[env].initial.metafields = Object.assign({}, state[env].initial.metafields, {})
            } else {
                  const keyPath = `${metafield.namespace}.${metafield.key}`
                  const metafields:any = state[env].metafields === null ? {} : state[env].metafields
                  metafields[keyPath] = metafield
                  state[env].metafields =  Object.assign({}, state[env].metafields, metafields)
                  const initialMetafields:any = !state[env]?.initial?.metafields ? state[env]?.initial?.metafields : {}
                  if (initial) {
                      initialMetafields[keyPath] = metafield
                      state[env].initial.metafields =  Object.assign({}, state[env].initial.metafields, initialMetafields)
                  }
                  
            }
      },
      setChanges(state: State, { env, changes }: { env: ShopEnv, changes: { product: string[], metafields: string[] } }) {
            state[env].changes = Object.assign({}, state[env].changes, changes)
      },
      saving(state: State, { from, to }: { from: ShopEnv | null; to: ShopEnv[] | null}) {
            state.saving = Object.assign({}, state.saving, { from, to })
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
                  product: val?.initial?.product ? val.initial.product
                        : product?.handle && state[env]?.initial?.product?.handle && product?.handle === state[env]?.initial?.product?.handle ?     
                        state[env]?.initial?.product
                        : product,
                  metafields: val?.initial?.metafields ? val.initial.metafields 
                        : merge && state[env].metafields !== null ? { ...state[env].metafields, ...metafields } : metafields === undefined ? null : metafields
            };
            state[env] = Object.assign({}, state[env], { product, metafields, initial })
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
                  const metafield = await this.$db.doc(docPath).then((res: any) => {
                        if (res?.key) { return res }
                        return {
                              key,
                              namespace,
                              value: false,
                              docId: docPath.split('/').pop(),
                              docPath
                        }
                  });
                  commit('setMetafield', {env, metafield, initial: true})
                  // const metafields = { ...(state[env]?.metafields || {}), [keyPath]: data }
                  // commit("setEnvState", {
                  //       env,
                  //       product: state[env]?.product?.handle !== handle ? null : state[env].product,
                  //       metafields,
                  //       initial: {
                  //             product: state[env]?.product?.handle !== handle ? null : state[env].initial.product,
                  //             metafields: metafields[keyPath]?.docPath === (state[env]?.metafields && state[env]?.metafields[keyPath] ? state[env]?.metafields[keyPath]?.docPath : null) ? state[env].metafields : metafields,
                  //       }
                  // });
                  return metafield
            }

      },
      setProduct({ commit, dispatch }: any, { env, product }: { env: ShopEnv, product: any }) {
            commit('setProduct', { env, product })
            setTimeout(() => {
                  dispatch('getChanges', env)
            }, 500)
      },
      setMetafield({ commit, dispatch }: any, { env, metafield }: { env: ShopEnv, metafield: any }) {
            commit('setMetafield', { env, metafield })
            setTimeout(() => {
                  dispatch('getChanges', env)
            }, 500)
      },
      getChanges({ state, commit }: any,  env: ShopEnv) {
            const product = state[env]?.product;
            const initialProduct = state[env]?.initial?.product;
            const metafields: any = state[env]?.metafields
            const initialMetafields: any = state[env]?.initial?.metafields
            const changes: { product: string[], metafields: string[] } = { product: [], metafields: [] }
            console.log({
                  initialProduct, product
            })
            if (product) {
                  if (
                        !objectsAreTheSame(product?.tags?.split(', '), initialProduct?.tags?.split(', '))
                        || product?.title !== initialProduct?.title
                        || product?.body_html !== initialProduct?.body_html
                  ) {
                        changes.product.push('info')
                  }
                  if (!objectsAreTheSame(product?.images, initialProduct?.images)) {
                        changes.product.push('images')
                  }
            }
            if (metafields) {
                  Object.keys(metafields).forEach(keyPath => {
                        if (!objectsAreTheSame(metafields[keyPath].value, initialMetafields[keyPath].value)) {
                              changes.metafields.push(keyPath.indexOf('the.') === 0 ? 'filters' : keyPath)
                        }
                  })
            }
            commit('setChanges', {env, changes})
      },
      async save({state, commit}:any, {shouldSave}: { shouldSave: string[] }) {
            const errors: any[] = []
            const saved: any[] = []
            const products:any = {
                  [ShopEnv.LIVE]: state[ShopEnv.LIVE]?.product,
                  [ShopEnv.DEV]: state[ShopEnv.DEV]?.product,
            }
            const metafields:any = {
                  [ShopEnv.LIVE]: state[ShopEnv.LIVE]?.metafields,
                  [ShopEnv.DEV]: state[ShopEnv.DEV]?.metafields,
            }
            const savingFrom = state.saving.from;
            const savingTo = state.saving.to;
            if (typeof savingFrom !== 'string' || !Array.isArray(savingTo)) {
                  return
            }
            const nextState = JSON.parse(JSON.stringify(state));
            const saveProduct = async (): Promise<any> => {
                  if(savingFrom === null || savingTo === null) { return }
                  const product:any = shouldSave.includes('info') 
                        ? {
                              title: products[savingFrom].title,
                              tags: products[savingFrom].tags,
                              body_html: products[savingFrom].body_html,
                        }
                        : {};
                  if (shouldSave.includes('images')) {
                        product.images = products[savingFrom].images
                  }
                  if (!Object.keys(product)?.length) {
                        return
                  }
                  return await Promise.all(savingTo.map((env:string) => {
                        const data = {
                              ...product,
                              id: products[env].id
                        }
                        if (shouldSave.includes('images')) {
                              data.images = product.images.map((image: any) => {
                                    const img: {[key:string]: any } = { alt: image.alt, src: image.src, position: image.position }
                                    if (env === savingFrom) {
                                          img.id = image.id
                                    }
                                    return img
                              })
                        }
                        console.log({ data })
                        return this.$shops[env].put({ path: `products/${products[env].id}`, data  })
                              .then(() => {
                                    ['info', 'images'].filter(k => shouldSave.includes(k)).forEach(k => {
                                          saved.push(k)
                                    });
                                    if (shouldSave.includes('images')) {
                                          nextState[env].product.images = data.images
                                          nextState[env].initial.product.images = data.images
                                    }
                                    if (shouldSave.includes('info')) {
                                          nextState[env].product.title = data.title
                                          nextState[env].initial.product.title = data.title
                                          nextState[env].product.tags = data.tags
                                          nextState[env].initial.product.tags = data.tags
                                          nextState[env].product.body_html = data.body_html
                                          nextState[env].initial.product.body_html = data.body_html
                                    }
                              })
                              .catch((err:any) => {
                                    console.error(err)
                                    errors.push(err)
                              })
                        }))
            }
            const saveMetafields = async ():Promise<any> => {
                  if(savingFrom === null || savingTo === null) { return }
                  const envMetafields = Object.keys(metafields[savingFrom])
                        .map(k => savingFrom === null ? null : metafields[savingFrom][k]);
                  if (!envMetafields?.length) { return };
                  const nonFilterMetafields = shouldSave
                        .filter((k:string) => k.indexOf('studio.') === 0);
                  const promises:Promise<any>[] = [];
                  nonFilterMetafields.forEach((k:string) => savingTo === null ? '' : savingTo.forEach((env:string) => {
                  const pathKey = k.replace('featured_reviews', 'featuredReviews')
                  const docPath = `products_${env}/${products[env].handle}/metafields/${k.split('.')[1]}`;
                  if(savingFrom === null || savingTo === null) { return }
                  const data = {...metafields[savingFrom][pathKey], docPath}
                  promises.push(
                        this.$db.updateAt(docPath, data)
                              .then(() => {
                                    nextState[env].metafields[pathKey] = data
                                    nextState[env].initial.metafields[pathKey] = data
                                    saved.push(k)
                              })
                              .catch((err:any) => {
                                    console.error(err);
                                    errors.push(err)
                              })
                        )
                  }));
                  await Promise.all(promises.map(p => p ))
            }
            await Promise.all([
                  saveProduct(),
                  saveMetafields()
            ])
            console.log({nextState})
            commit('setState', nextState)
            
            return { saved, errors }
      }
}