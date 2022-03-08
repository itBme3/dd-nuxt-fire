import { RequestParams, ShopEnv } from "~/models/shopify.models";

export const shopDomains = {
      live: 'https://dearborndenim.us',
      dev: 'https://dearborn-denim-dev.myshopify.com'
}

export const shopAdminDomains = {
      live: 'https://dearborn-denim-apparel.myshopify.com/admin',
      dev: 'https://dearborn-denim-dev.myshopify.com/admin'
}

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