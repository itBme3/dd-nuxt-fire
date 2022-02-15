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
