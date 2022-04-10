/* eslint-disable camelcase */
import Vue from 'vue'
import { DataType, ShopEnv } from "~/models/shopify.models";
import { flattenArray, getRandomNumber } from "~/utils/funcs";
import { productHandleExists, defaultsByProductType } from "~/utils/products";
import { shopAdminDomains } from "~/utils/shopify";

interface StateProductOption {
      name: string;
      values: string[]
}

interface StateProductMetafieldDoc {
      key: string;
      namespace: string;
      value: any;
}

interface StateProductVariant {
      title: string;
      weight_unit: 'lb' | 'oz';
      inventory_management: 'shopify';
      inventory_policy: 'continue';
      weight: number | null;
      price: string | null;
      compare_at_price: string | null;
      option1: string | null;
      option2: string | null;
      option3: string | null;
      sku?: string;
}

interface StateProduct {
      title: string;
      handle: string;
      body_html: string;
      tags: string;
      price: number | null;
      options: StateProductOption[];
      variants: StateProductVariant[];
      weight: number | null;
      weight_unit: 'lb' | 'oz' | null;
}

interface StateUniqueSkus {
      [ShopEnv.LIVE]: string[];
      [ShopEnv.DEV]: string[];
}

interface State {
      product: StateProduct;
      uniqueSkus: StateUniqueSkus;
      envs: ShopEnv[];
      excludedVariants: string[];
      metafields: {[key:string]: any};
}

const initialState:State = {
      product: {
            title: '',
            handle: '',
            body_html: '',
            tags: '',
            price: null,
            weight: null,
            weight_unit: 'lb',
            options: [],
            variants: []
      },
      metafields: {},
      uniqueSkus: { [ShopEnv.DEV]: [], [ShopEnv.LIVE]: [] },
      envs: [ShopEnv.LIVE, ShopEnv.DEV],
      excludedVariants: []
}

export const state = (): State => ({
      ...JSON.parse(JSON.stringify(initialState))
});

export const mutations = {

      resetState(state: State) {
            state.product = Object.assign({}, state.product, initialState)
      },

      setEnvs(state: State, val:ShopEnv[]) {
            const envs = [];
            if (!Array.isArray(val) || val.includes(ShopEnv.LIVE)) {
                  envs.push(ShopEnv.LIVE)
            }
            if (val?.includes(ShopEnv.DEV)) {
                  envs.push(ShopEnv.DEV)
            }
            Vue.set(state, 'envs', envs)
      },
      
      setProduct(state: State, { value, merge }: { value: StateProduct; merge?: boolean }) {
            const merging = [undefined, true].includes(merge);
            const data = { ...(merging ? state.product : initialState.product), ...value };
            state.product = Object.assign({}, state.product, data)
      },

      setOnProduct(state: State, { key, value }: { key: string; value: StateProduct; }) {
            state.product = Object.assign({}, state.product, { ...state.product, [key]: value })
      },

      setMetafield(state: State, { metafield, merge }: { metafield: StateProductMetafieldDoc; merge?: boolean }) {
            const merging = [undefined, true].includes(merge);
            const keyPath = `${metafield.namespace}.${metafield.key}`
            const data = { ...(merging && state.metafields !== undefined ? state.metafields[keyPath] : {}), ...metafield };
            state.metafields = Object.assign({}, state.metafields, {...state.metafields, [keyPath]: data})
      },

      setMetafields(state: State, { value, merge }: { value: StateProductMetafieldDoc[]; merge?: boolean }) {
            const merging = [undefined, true].includes(merge);
            const data = { ...(merging ? state.metafields : initialState.metafields), ...value };
            state.metafields = Object.assign({}, state.metafields, data)
      },

      setExcludedVariants(state: State, excludedVariants: string[]) {
            if (!Array.isArray(state.excludedVariants)) {
                  state.excludedVariants = []
            }
            state.excludedVariants = JSON.parse(JSON.stringify(state.excludedVariants.filter(v => excludedVariants.includes(v))));
            for (const variantTitle of excludedVariants) {
                  if (!state.excludedVariants.includes(variantTitle)) {
                        state.excludedVariants.push(variantTitle)
                  }
            }
      },

      setUniqueSkus(state:State, skus:string[]) {
            state.uniqueSkus = Object.assign({}, state.uniqueSkus, skus)
      }

}

export const actions:any = {

      copyFrom({ state }: any, { env }: { env?: ShopEnv } = { env: ShopEnv.LIVE }) {
            return new Promise((resolve) => {
                  const shopEnv = env === ShopEnv.DEV ? ShopEnv.DEV : ShopEnv.LIVE
                  const onSubmit = (product: any) => {
                        return (() => {
                              return this.app.store.dispatch('productCreate/setProductFromCopy', { product, env: shopEnv })
                                    .then(resolve)
                                    .catch((err: any) => console.error(err))
                        })()
                  }
                  this.app.store.commit('algoliaSelect/open', {
                        props: JSON.parse(JSON.stringify({
                              indexName: `products_${shopEnv}`,
                              selected: null,
                              selecting: {
                                    multiple: false,
                              }
                        })), 
                        onSubmit(e:any) {
                              onSubmit(e)
                        }, 
                        onCancel() {
                              resolve(false)
                        }
                  })
            })
      },

      async setProductFromCopy({ state }: any, { product, env }: { product: any; env: ShopEnv }) {
            if(!product?.handle) { return null }
            const shopProduct = await this.$shops[env].get({ 
                        path: 'products', 
                        query: { 
                        fields: 'id,title,body_html,product_type,handle,status,tags,images,options,variants',
                        handle: product.handle,
                        limit: 1
                  } })
                        .then((res:any) => res.data[0])
                        .catch((err:any) => {
                              return { ERROR: err.message }
                        })
            const {
                  title = state?.product?.title,
                  handle = state?.product?.handle,
                  body_html = state?.product?.body_html,
                  tags:newTags = state?.product?.tags,
                  price = shopProduct?.variants[0]?.price || state.product.price,
                  weight = shopProduct?.variants[0]?.weight || state.product.weight,
                  weight_unit = shopProduct?.variants[0]?.weight_unit || state.product.weight_unit,
                  product_type = state?.product?.product_type,
                  options = state?.product?.options,
                  variants = state?.product?.variants,
            } = shopProduct;
            const tags = (() => {
                  const stateTags = state?.product?.tags || [];
                  return [...new Set([
                        ...(typeof newTags === 'string' ? newTags.split(', ') : Array.isArray(newTags) ? newTags : []),
                        ...(typeof stateTags === 'string' ? stateTags.split(', ') : Array.isArray(stateTags) ? stateTags : []),
                  ])].join(', ')
            })();
            const images:any[] = Array.isArray(state?.product?.images) ? state.product.images : [];
            const newProduct = {
                  title: state?.product?.title?.length ? state.product.title : title,
                  handle: state?.product?.handle?.length ? state.product.handle : handle,
                  body_html,
                  tags,
                  images,
                  product_type,
                  price, weight, weight_unit,
                  options: options?.map((item: any) => {
                        const { name, values, position } = item;
                        return { name, values, position }
                  }) || [],
                  variants: variants?.map((item: any) => {
                        const {
                              position, title,
                              option1, option2, option3,
                              weight = state.product.weight,
                              weight_unit = state.product.weight_unit,
                              price = state.product.price, template_suffix,
                        } = item;
                        return {
                              position, title,
                              template_suffix,
                              option1, option2, option3,
                              weight, weight_unit,
                              price, compare_at_price: null,
                              inventory_management: 'shopify',
                              inventory_policy: 'continue',
                              inventory_quantity: 0,
                              requires_shipping: true,
                              taxable: true,
                        }
                  }) || []
            }
            const metafields = await (() => {
                  try {
                        return this.$db.collection(`products_live/${handle}/metafields`, (ref:any) => ref.where('key', 'not-in', ['featuredReviews']))
                              .then((docs: any) => docs.reduce((acc:{[key:string]: any}, doc: any) => {
                                    const { namespace, key } = doc;
                                    const keyPath = `${namespace}.${key}`
                                    return {
                                          ...acc,
                                          [keyPath]: keyPath === 'studio.product_details' && !!doc?.value?.blocks?.length
                                                ? {
                                                      ...doc, value: {
                                                            ...doc.value, blocks: doc.value.blocks.map((b:any, i:number) => {
                                                                  return {
                                                                        ...b,
                                                                        image_index: i + 3
                                                                  }
                                                            })
                                                      }
                                                }
                                                : doc
                                    }
                              }, {}))
                  } catch (err: any) {
                        throw new Error(err)
                  }
            })();
            this.app.store.commit('productCreate/setProduct', { value: newProduct })
            this.app.store.commit('productCreate/setMetafields', {value: metafields})
            return {product: { title, handle, body_html, tags, images, options, variants }, metafields }
      },

      setVariants({ state, commit }: any) {
            
            const product = JSON.parse(JSON.stringify(state.product));
            if(!product) { return }
            const productType = product?.product_type || null;
            const defaults = defaultsByProductType[productType]
            const options = product?.options?.length
                  ? product.options
                  : defaults?.options?.length
                        ? defaults.options
                        : [];
            if ( !options?.length && !!defaults ) {
                  return commit('setProduct', { product: { variants: [] }  })
            }
            if ( defaults?.options?.length && options[0]?.values?.length === 0 ) {
                  product.options = defaults.options
                  const excludedVariants = defaults?.excludedVariants || state?.excludedVariants
                  commit('setExcludedVariants', Array.isArray(excludedVariants) ? excludedVariants : [] )
            }
            
            ['weight', 'weight_unit', 'price'].forEach((key:string) => {
                  if (!product[key]?.length && !!defaults && !!defaults[key]?.length) {
                        product[key] = defaults[key]
                  }
            })
            
            if (defaults?.tags?.split) {
                  const tags = product?.tags?.split(', ') || [];
                  product.tags = [
                        ...tags,
                        ...defaults.tags
                              .split(', ')
                              .filter((tag: string) => !tags.includes(tag))
                  ].filter(tag => !!tag?.length).join(', ')
            }
            const option1 = options[0] || null;
            const option2 = options[1] || null;
            const option3 = options[2] || null;
            const excludedVariants = state?.excludedVariants || [];
            const variants: StateProductVariant[] = [];
            if([undefined, null].includes(option1)) {return}
            if ([undefined, null].includes(option2?.name)) {
                  option1.values.forEach((value1:string) => {
                        variants.push({
                              title: value1,
                              option1: value1,
                              option2: null,
                              option3: null,
                              price: state.product.price,
                              compare_at_price: null,
                              inventory_management: 'shopify',
                              inventory_policy: 'continue',
                              weight_unit: state.product.weight_unit,
                              weight: state.product.weight,
                        })
                  })
            } else if ([undefined, null].includes(option3?.name)) {
                  option1.values.forEach((value1:string) => {
                        option2.values.forEach((value2: string) => {
                              const title = `${value1} / ${value2}`;
                              if (!excludedVariants?.includes(title)) {
                                    variants.push({
                                          title,
                                          option1: value1,
                                          option2: value2,
                                          option3: null,
                                          price: state.product.price,
                                          compare_at_price: null,
                                          inventory_management: 'shopify',
                                          inventory_policy: 'continue',
                                          weight_unit: state.product.weight_unit,
                                          weight: state.product.weight,
                                    })
                              }
                        })
                  })
            } else {
                  option1.values.forEach((value1:string) => {
                        option2.values.forEach((value2: string) => {
                              option2.values.forEach((value3: string) => {
                                    const title = `${value1} / ${value2} / ${value3}`;
                                    if (!excludedVariants?.includes(title)) {
                                          variants.push({
                                                title,
                                                option1: value1,
                                                option2: value2,
                                                option3: value3,
                                                price: state.product.price,
                                                compare_at_price: null,
                                                inventory_management: 'shopify',
                                                inventory_policy: 'continue',
                                                weight_unit: state.product.weight_unit,
                                                weight: state.product.weight,
                                          })
                                    }
                              })
                        })
                  })
            }
            commit('setProduct', { value: { ...product } })
            return variants
      },

      async getUniqueSkus({ commit, state }:any) {
            // const { commit, state } = context;
            if (state.uniqueSkus?.length === 100) {
                  return state.uniqueSkus
            }
            const uniqueSkus: StateUniqueSkus = { live: [], dev: [] }
            const existing: StateUniqueSkus = { live: [], dev: [] }
            const generatedSkus: string[] = []
            for (let i = 0; i < 300; i++) {
                  generatedSkus.push(`SKU${getRandomNumber(10000000, 99999999)}`)
            }
            const batchSize = 10;
            const batchCount = 300 / batchSize;
            for (let i = 0; i < batchCount; i++) {
                  await (async () => {
                        const testSkus = generatedSkus.slice(i * batchCount, i * batchCount + batchSize);
                        await Promise.all([ShopEnv.LIVE, ShopEnv.DEV].map(env => 
                               this.$db.collection(`products_${env}/ALL_SKUS/products`, (ref: any) => ref.where('skus', 'array-contains-any', testSkus))
                                     .then((docs: any) =>
                                           flattenArray(docs.map((doc: any) => doc?.skus))
                                                .forEach((sku:string) => !existing[env].includes(sku) ? existing[env].push(sku) : '')
                                    )
                        )).catch(console.error)
                        testSkus.forEach(sku => {
                              if (uniqueSkus[ShopEnv.LIVE].length < 100 && !existing[ShopEnv.LIVE].includes(sku)) {
                                    uniqueSkus[ShopEnv.LIVE].push(sku)
                              }
                              if (uniqueSkus[ShopEnv.DEV].length < 100 && !existing[ShopEnv.DEV].includes(sku)) {
                                    uniqueSkus[ShopEnv.DEV].push(sku)
                              }
                        })
                  })();
                  if (uniqueSkus[ShopEnv.LIVE].length >= 100 && uniqueSkus[ShopEnv.DEV].length >= 100) {
                        commit('setUniqueSkus', uniqueSkus)
                        return uniqueSkus
                  }
            }
      },

      async create({ state }:{state: State}) {
            const products: { [ShopEnv.LIVE]: { [key: string]: any; }; [ShopEnv.DEV]: { [key: string]: any } } = {
                  [ShopEnv.LIVE]: {
                        ...state.product,
                        status: 'active',
                        published_scope: 'global',
                        variants: state.product.variants.map((variant:StateProductVariant, i:number) => {
                              return { ...variant, sku: state.uniqueSkus[ShopEnv.LIVE][i] }
                        })
                  },
                  [ShopEnv.DEV]: {
                        ...state.product,
                        status: 'active',
                        published_scope: 'global',
                        variants: state.product.variants.map((variant:StateProductVariant, i:number) => {
                              return { ...variant, sku: state.uniqueSkus[ShopEnv.DEV][i] }
                        })
                  }
            }
            const created: { [ShopEnv.LIVE]: any;  [ShopEnv.DEV]: any} = {
                  [ShopEnv.DEV]: null,
                  [ShopEnv.LIVE]: null,
            }
            const promises = state.envs.map(async (env: ShopEnv) => {
                  const handleExists = await productHandleExists(state.product.handle, env, this.$shops)
                  if (handleExists) {
                        const errMessage = `Product handles must be unique.\nThe handle "${state.product.handle}" exists on "${env.toUpperCase()}" shop.`
                        alert(errMessage)
                        throw new Error(errMessage);
                  }
                  return this.$shops[env].post({
                        path: 'products',
                        data: products[env === ShopEnv.DEV ? ShopEnv.DEV : ShopEnv.LIVE],
                        type: DataType.JSON
                  })
                        .then(async (res: any) => {
                              created[env] = res.data
                              await this.$shops[env].put({ path: `products/${res.data.id}`, data: { status: 'draft' } })
                                    .catch(console.error)
                              return created
                        })
            });
            if (state.metafields && Object.keys(state.metafields).length) {
                  Object.keys(state.metafields).forEach((key: string) => {
                        state.envs.forEach((env: ShopEnv) => {
                              const docId = state.metafields[key].docPath.split('/').pop()
                              const docPath = `products_${env}/${state.product.handle}/metafields/${docId}`
                              promises.push(this.$db.updateAt(docPath, {
                                    ...state.metafields[key],
                                    docPath,
                                    docId
                              }))
                        })
                  })
            }
            return await Promise.all(promises).then(() => {
                  this.$router.push(`/products/${state.product.handle}${!created[ShopEnv.LIVE]?.id ? '#dev' : '' }`)
                  if (created[ShopEnv.LIVE]?.id) {
                        window.open(`${shopAdminDomains[ShopEnv.LIVE]}/products/${created[ShopEnv.LIVE]?.id}`, '_blank')
                  }
                  if (created[ShopEnv.DEV]?.id) {
                        window.open(`${shopAdminDomains[ShopEnv.DEV]}/products/${created[ShopEnv.DEV]?.id}`, '_blank')
                  }
                  return created
            })
      },

      setExcludedVariants({dispatch, commit}: any, value: string[]) {
            commit('setExcludedVariants', value)
            setTimeout(() => {
                  dispatch('setVariants')
            }, 250)
      }

}