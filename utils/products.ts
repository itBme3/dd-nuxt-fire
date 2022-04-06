import { ShopEnv } from "~/models/shopify.models";
import { ShopsApi } from "./shopify";

/* eslint-disable camelcase */
export enum ProductType {
      JEANS = 'Jeans',
      BELT = 'Belt',
      T_SHIRT = 'T-Shirt',
      SHIRT = 'Shirt',
      SWEATSHIRT = 'Sweatshirt',
      DRESS = 'Dress',
      SHORTS = 'Shorts',
      JOGGERS = 'Joggers',
      BUTTON_DOWN_SHIRT = 'Button Down Shirt',
      TANK_TOP = 'Tank Top'
};
export const productTypes = Object.values(ProductType)

interface ProductTypeDefaultOptions {
      tags?: string;
      excludedVariants?: string[];
      weight?: string;
      weight_unit?: string;
      options?: {
            name: string;
            position: number;
            values: string[];
      }[]
}

class DefaultsByProductType {
      [ProductType.JEANS]: ProductTypeDefaultOptions
      [ProductType.BELT]: ProductTypeDefaultOptions
      [ProductType.SHIRT]: ProductTypeDefaultOptions
      [ProductType.DRESS]: ProductTypeDefaultOptions
      [ProductType.T_SHIRT]: ProductTypeDefaultOptions
      [ProductType.SWEATSHIRT]: ProductTypeDefaultOptions
      [ProductType.SHORTS]: ProductTypeDefaultOptions
      [ProductType.JOGGERS]: ProductTypeDefaultOptions
      [ProductType.BUTTON_DOWN_SHIRT]: ProductTypeDefaultOptions
      [ProductType.TANK_TOP]: ProductTypeDefaultOptions
      
      
      constructor() {
            this[ProductType.JEANS] = {
                  options: [
                        {
                              name: 'Size', position: 1,
                              values: [
                                    '28', '29', '30',
                                    '31', '32', '33',
                                    '34', '35', '36',
                                    '38', '40', '42'
                              ]

                        },
                        {
                              name: 'Length',
                              position: 2,
                              values: [
                                    '28', '31', '30',
                                    '33', '32', '29',
                                    '34', '35', '36'
                              ]
                        },
                  ],
                  tags: 'category:Apparel, apparel:Bottoms',
                  weight: '1.1993',
                  weight_unit: 'lb',
                  excludedVariants: [
                        '28 / 35', '28 / 36',
                        '29 / 35', '29 / 36',
                        '30 / 35', '30 / 36',
                        '31 / 35', '31 / 36'
                  ]
            }
            this[ProductType.BELT] = {
                  options: [
                        {
                              name: 'Size', position: 1,
                              values: [
                                    '28', '30', '32',
                                    '34', '36', '38',
                                    '40', '42'
                              ]

                        }
                  ],
                  tags: 'category:Accessories, material:Horween Leather',
                  weight: '1.1993',
                  weight_unit: 'lb',
                  excludedVariants: [
                        '28 / 35', '28 / 36',
                        '29 / 35', '29 / 36',
                        '30 / 35', '30 / 36',
                        '31 / 35', '31 / 36'
                  ]
            }
            this[ProductType.SHIRT] = {
                  tags: 'apparel:Tops, category:Apparel',
                  weight: '5.9966',
                  weight_unit: 'oz',
                  options: [
                        {
                              name: 'Size',
                              position: 1,
                              values: [
                                    'Small', 'Medium',
                                    'Large', 'X-Large'
                              ]
                        }
                  ]
            }
            this[ProductType.BUTTON_DOWN_SHIRT] = {
                  tags: this[ProductType.SHIRT].tags,
                  weight: '9',
                  weight_unit: 'oz',
                  options: [{
                        name: 'Size',
                        position: 1,
                        values: [
                              '36', '38', '40',
                              '42', '44', '46'
                        ]
                  }]
             }
            this[ProductType.T_SHIRT] = { ...this[ProductType.SHIRT] }
            this[ProductType.SWEATSHIRT] = { ...this[ProductType.SHIRT] }
            this[ProductType.TANK_TOP] = { ...this[ProductType.SHIRT] }
            this[ProductType.DRESS] = { ...this[ProductType.SHIRT] }
      }
      
}

export const defaultsByProductType: {[key:string]: any} = new DefaultsByProductType();

export const productHandleExists = (handle: string, env: ShopEnv, $shops: ShopsApi) => {
      return $shops[env].get({ path: '/products', query: { fields: 'handle', handle, limit: 1 } })
            .then(res => res[0]?.handle === handle)
}

/* PRODUCT CHARTS */
export const duplicateChart = (chartDoc: { [key: string]: any }, $db: any) => {
      try {
            chartDoc.chart = `${chartDoc.chart} (copy)`
            delete chartDoc.docId
            delete chartDoc.docPath
            console.log({ chartDoc })
            return $db.updateAt('size_charts', chartDoc)
                  .then((res:any) => {
                        console.log(res);
                        window.open(`/products/size-charts/${res.docId}`, '_blank')
                  })
                  .catch((err:any) => { throw err })
      } catch (errs) {
            console.error(errs)
            alert(errs);
      }
}

export const deleteChart = async (docId:String, $db:any, $router:any = false) => {
      try {
            await $db.delete(`size_charts/${docId}`)
            if ($router) {
                  $router.push('/products/size-charts')
            }
      } catch (err) {
            alert(err)
      }
}
