export enum ShopEnv {
  LIVE = 'live',
  DEV = 'dev',
}

export declare enum ShopMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

export declare enum DataType {
    JSON = "application/json",
    GraphQL = "application/graphql",
    URLEncoded = "application/x-www-form-urlencoded"
}
export interface GetRequestParams {
    path: string;
    type?: DataType;
    data?: Record<string, unknown> | string;
    query?: Record<string, string | number>;
    tries?: number;
}
export declare type PostRequestParams = GetRequestParams & {
    type: DataType;
    data: Record<string, unknown> | string;
};
export declare type PutRequestParams = PostRequestParams;
export declare type DeleteRequestParams = GetRequestParams;
export declare type RequestParams = (GetRequestParams | PostRequestParams) & {
    method: ShopMethod;
};
export interface RequestReturn {
    body: unknown;
    headers: Headers;
}