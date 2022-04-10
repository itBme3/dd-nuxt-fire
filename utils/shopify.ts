import { DeleteRequestParams, GetRequestParams, PostRequestParams, PutRequestParams, ShopEnv } from "~/models/shopify.models";

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

      get(params: GetRequestParams): Promise<any> {
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'get', params })
                  .catch((err:any) => alert(err))
      }

      async post(callParams: PostRequestParams):Promise<any> {
            const params = await this.imageSources(callParams)
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'post', params })
                  .catch((err:any) => alert(err))
      }

      async put(callParams: PutRequestParams): Promise<any> {
            const params = await this.imageSources(callParams)
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'put', params })
                  .catch((err:any) => alert(err))
      }

      delete(params: DeleteRequestParams):Promise<any> {
            return this.$fire.functions.httpsCallable('shopifyApi')({ env: this.env, method: 'delete', params })
                  .catch((err:any) => alert(err))
      }

      async imageSources(params: PutRequestParams | PostRequestParams):Promise<any> {
            if (params?.data?.images?.filter((image: any) => image.src?.includes('media%2F')).length > 0) {
                  params.data.images = await Promise.all(params.data.images.map((image: any) => {
                        if (!image?.src?.includes('media%2F')) { return image }
                        let name = image.src.split('media%2F')[1].split('?');
                        name.pop();
                        name = name.join('?')
                        return this.$fire.functions.httpsCallable('tempImage')(name)
                              .then((res: any) => {
                                    return {
                                          ...image,
                                          src: res.data
                                    }
                              })
                  }))
            }
            return params
      }
      
}