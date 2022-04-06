import { DeleteRequestParams, GetRequestParams, PostRequestParams, PutRequestParams, RequestParams, ShopEnv } from "~/models/shopify.models";

export const shopDomains = {
      live: 'https://dearborndenim.us',
      dev: 'https://dearborn-denim-dev.myshopify.com'
}

export const shopAdminDomains = {
      live: 'https://dearborn-denim-apparel.myshopify.com/admin',
      dev: 'https://dearborn-denim-dev.myshopify.com/admin'
}

export interface ShopApi {
      env: ShopEnv;
      $fire: any;
      get(params: GetRequestParams):Promise<any>;
      post(params: PostRequestParams):Promise<any>;
      put(params: PutRequestParams):Promise<any>;
      delete(params: DeleteRequestParams):Promise<any>;
}

export type ShopsApi = {
      [key in ShopEnv]: ShopApi;
};
export class Shopify implements ShopApi {
      env = ShopEnv.LIVE
      $fire
      constructor(props: {env: ShopEnv, app: {$fire:any, [key:string]:any} /* $nuxt */}) {
            this.$fire = props.app.$fire
            if (props.env === ShopEnv.DEV) {
                  this.env = ShopEnv.DEV
            }
      }

      get(params: GetRequestParams):Promise<any> {
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'get', params })
                  .catch((err:any) => alert(err))
      }

      post(params: PostRequestParams):Promise<any> {
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'post', params })
                  .catch((err:any) => alert(err))
      }

      put(params: PutRequestParams):Promise<any> {
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'put', params })
                  .catch((err:any) => alert(err))
      }

      delete(params: DeleteRequestParams):Promise<any> {
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'delete', params })
                  .catch((err:any) => alert(err))
      }
      
}