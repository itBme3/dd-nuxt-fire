

import algoliasearch, { SearchClient } from 'algoliasearch/lite'
import qs from 'qs'

import {AlgoliaFilterObjectType, AlgoliaFilterObject} from '~/models/algolia.model'

export function initializeAlgoliaClient (clientCredentials: { appId: string, apiKey: string }): SearchClient {
  return algoliasearch(
            clientCredentials.appId,
            clientCredentials.apiKey
      );
}

export const algoliaSearchClient:SearchClient = initializeAlgoliaClient({ appId: '010RMUCHO8', apiKey: '9610abb7baa7ae39ae7bc28dc246aaa7'});


export const filterOptionsByIndex:{[key:string]: string[]} =  {
      products: ['fit', 'tags', 'material', 'color', 'wash', 'updatedAt', 'createdAt'],
      media: ['fits', 'tags', 'materials', 'colors', 'wash', 'updatedAt', 'createdAt', 'products', 'rating'],
      reviews: ['product.tags', 'product.handle', 'score'],
}

export const bulkEditOptionsByIndex:{[key:string]: string[]} =  {
      products: ['tags'],
      media: ['fits', 'tags', 'materials', 'colors', 'wash', 'products'],
}

const filterOptionKeys = [
      ...Object.values(filterOptionsByIndex).reduce((acc, arr) => {
            return [...new Set([...acc, ...arr])]
      }, [])
]

export const filterOptions:{[key:string]: any} = {
  ...filterOptionKeys.reduce((acc, attribute) => {
      return {...acc, [attribute]: {
            attribute, 
            value: undefined,
            type: ['score', 'rating', 'updatedAt', 'createdAt'].includes(attribute)
                  ? AlgoliaFilterObjectType.RANGE : AlgoliaFilterObjectType.REFINEMENT_LIST,
            not: false,
            or: []
      }}
  }, {})
}


export const stringifyAlgoliaFilters = (filterArr: AlgoliaFilterObject[], operator: 'AND' | 'OR' = 'AND') => {
      const objectToFilterString = (filterObj: AlgoliaFilterObject): string => {
            let filterString = filterObj.not ? 'NOT ' : ''
            if (filterObj.type === AlgoliaFilterObjectType.REFINEMENT_LIST) {
                  filterString += `${ filterObj.attribute }:"${ filterObj.value }"`
            }
            if (filterObj.type === AlgoliaFilterObjectType.NUMBER) {
                  filterString += `${ filterObj.attribute } = ${ filterObj.value }`
            }
            if (filterObj.type === AlgoliaFilterObjectType.RANGE && Array.isArray(filterObj.value)) {
                  const filterType = ['score', 'rating'].includes(filterObj.attribute)
                        ? 'number'
                        : ['createdAt', 'updatedAt'].includes(filterObj.attribute)
                              ? 'date'
                              : 'string';
                  const start = filterType === 'string' ? `"${filterObj.value[0]}"` : filterType === 'date' ? new Date(filterObj.value[0]).getTime() : filterObj.value[0];
                  const end = filterType === 'string' ? `"${filterObj.value[1]}"` : filterType === 'date' ? new Date(filterObj.value[1]).getTime() : filterObj.value[1];
                  filterString += `${ filterObj.attribute }:${ start } TO ${ end }`
            }
            if (!filterObj?.or?.length) {
                  return filterString
            }
            if (filterObj.or) {
                  const orThis = stringifyAlgoliaFilters(filterObj.or, 'OR');
                  if (!orThis?.length) return filterString;
                  filterString = `( ${filterString} OR`;
                  filterString += ` ${ orThis } )`
                  return filterString
            }
            return filterString
      }
    if (!filterArr.length || filterArr.length === 0) {
          return ''
      }
    if (filterArr.length === 1) {
        return objectToFilterString(filterArr[0])
      }
    return filterArr.map(obj => objectToFilterString(obj))
      .join(` ${operator} `)
}

export const parseUrlParamFilters = (params: string) => {
      const parsed = qs.parse(params, { arrayLimit: 100 });
      const obj: any = parsed.filters;
      if (!obj?.reduce) return null;
      const res = {
            filters: obj.reduce((acc: any, filter: any) => {
                  const k = Object.keys(filter).filter(key => key !== 'or')[0];
                  if (!k) return acc;
                  const attr = k.includes('not_') ? k.replace('not_', '') : k;
                  const res = {
                        ...filterOptions[attr],
                        value: filter[k],
                        not: k.includes('not_'),
                        or: Array.isArray(filter.or) && filter.or.length > 0
                              ? filter.or.reduce((orAcc: any, orFilter: any) => {
                                    const _k = Object.keys(orFilter).filter(_key => _key !== 'or')[0];
                                    if (!_k) return orAcc;
                                    const _attr = _k.includes('not_') ? _k.replace('not_', '') : _k;
                                    return [...orAcc, {
                                          ...filterOptions[_attr],
                                          value: orFilter[_k],
                                          not: _k.includes('not_')
                                    }]
                              }, []) : null
                  }
                  if (!res?.or?.length) delete res.or;
                  return [...acc, res]
            }, [])
      }
      return res
}

export const stringifyUrlParamFilters = (filterVals: any) => {
      const vals = filterVals?.filters?.length ? filterVals.filters : filterVals
      return qs.stringify({
            filters: vals.reduce((acc: any, filter: any) => {
                  const key = `${filter.not ? 'not_' : ''}${filter.attribute}`
                  const param = { [key]: filter.value };
                  if (filter?.or?.length) {
                        param.or = filter.or.reduce((orAcc: any[], orFilter: any) => {
                              const orKey = `${orFilter.not ? 'not_' : ''}${orFilter.attribute}`
                              return [
                                    ...orAcc,
                                    {[orKey]: orFilter.value}
                              ]
                        }, [])
                  }
                  if(Object.keys(param).includes('or') && !param?.or?.length) delete param.or
                  return [
                        ...acc,
                        param
                  ]
            }, [])
      }, {encode: false})
}