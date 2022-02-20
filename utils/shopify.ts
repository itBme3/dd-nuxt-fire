import { RequestParams, ShopEnv } from "~/models/shopify.models";

export class Shopify {
      env = ShopEnv.DEV
      app
      constructor(props: {env: ShopEnv, app: any /* $nuxt */}) {
            this.app = props.app
            if (props.env === ShopEnv.LIVE) this.env = ShopEnv.LIVE
      }

      async get(params: RequestParams):Promise<any> {
            return await this.app.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'get', params })
      }

      async post(params: RequestParams):Promise<any> {
            return await this.app.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'post', params })
      }

      async put(params: RequestParams):Promise<any> {
            return await this.app.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'put', params })
      }

      async delete(params: RequestParams):Promise<any> {
            return await this.app.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'delete', params })
      }
      
}