import { Shopify } from '~/utils/shopify';
import { ShopEnv } from "~/models/shopify.models";

export default function (context, inject) {
      const app = { $fire: context.$fire }
      inject('shops', {
            live: new Shopify({ app, env: ShopEnv.LIVE }),
            dev: new Shopify({ app, env: ShopEnv.DEV }),
      })
}