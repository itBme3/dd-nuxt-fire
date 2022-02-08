

export enum AlgoliaFilterObjectType {
      REFINEMENT_LIST = 'refinement_list',
      NUMBER = 'number',
      RANGE = 'range'
}

export interface AlgoliaFilterObject {
      attribute: string,
      value: string | number | boolean | null | [string, string] | [number, number],
      type: AlgoliaFilterObjectType,
      not?: boolean,
      or?: null | AlgoliaFilterObject[]
}


export const convertToAlgoliaFilterString = (filterArr: AlgoliaFilterObject[], operator: 'AND' | 'OR' = 'AND') => {
      const objectToFilterString = (filterObj: AlgoliaFilterObject): string => {
            let filterString = filterObj.not ? 'NOT ' : ''
            if (filterObj.type === AlgoliaFilterObjectType.REFINEMENT_LIST) {
                  filterString += `${ filterObj.attribute }:"${ filterObj.value }"`
            }
            if (filterObj.type === AlgoliaFilterObjectType.NUMBER) {
                  filterString += `${ filterObj.attribute } = ${ filterObj.value }`
            }
            if (filterObj.type === AlgoliaFilterObjectType.RANGE && Array.isArray(filterObj.value)) {
                  const start = typeof filterObj.value[0] === 'string' ? `"${filterObj.value[0]}"` : filterObj.value[0];
                  const end = typeof filterObj.value[1] === 'string' ? `"${filterObj.value[1]}"` : filterObj.value[1];
                  filterString += `${ filterObj.attribute }:${ start } TO ${ end }`
            }
            if (!filterObj.or) {
                  return filterString
            }
            if(filterObj.or) {
                  filterString = `( ${filterString} OR`;
                  filterString += ` ${ convertToAlgoliaFilterString(filterObj.or, 'OR') } )`
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
