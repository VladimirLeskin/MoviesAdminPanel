import {AxiosResponse} from 'axios';
import {toast} from 'react-toastify';
import {ApiControllers, HttpClient} from './Api';
import {getAxiosErrorText} from './stdAxiosErrorHandler';

type Method = 'get' | 'delete' | 'post' | 'put' | 'patch' /* | 'head' | 'options' */;

interface Payload {
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  data?: unknown;
}

type Controller = {
  [path: string]: Partial<Record<Method, [Payload, unknown]>>;
};

type ExtractRoutesByMethod<TController extends Controller, TMethod extends Method> = {
  [TRoute in keyof TController]: TController[TRoute][TMethod] extends Array<unknown> ? TRoute : never;
}[keyof TController];

type ExtractRequestType<TController extends Controller, TRoute extends keyof TController, TMethod extends Method> = {
  request: TController[TRoute][TMethod] extends Array<unknown> ? TController[TRoute][TMethod][0] : never;
  response: TController[TRoute][TMethod] extends Array<unknown> ? TController[TRoute][TMethod][1] : never;
};

type Transport<TController extends Controller> = {
  [TMethod in Method]: <TRoute extends ExtractRoutesByMethod<TController, TMethod>>(
    url: TRoute,
    params: ExtractRequestType<TController, TRoute, TMethod>['request']
  ) => Promise<AxiosResponse<ExtractRequestType<TController, TRoute, TMethod>['response']>>;
};

export class TypesafeBaseApi {
  private static httpClient: HttpClient = new HttpClient({format: 'json', baseURL: '/'});
  protected static transport: Transport<ApiControllers> = {
    get: (url, params: Payload) => {
      return TypesafeBaseApi.httpClient
        .request({
          method: 'GET',
          path: url,
          query: params.query,
          headers: params.headers,
        })
        .catch(TypesafeBaseApi.processError);
    },
    post: (url, params: Payload) => {
      return TypesafeBaseApi.httpClient
        .request({
          method: 'POST',
          path: url,
          query: params.query,
          body: params.data,
          headers: params.headers,
        })
        .catch(TypesafeBaseApi.processError);
    },
    put: (url, params: Payload) => {
      return TypesafeBaseApi.httpClient
        .request({
          method: 'PUT',
          path: url,
          query: params.query,
          body: params.data,
          headers: params.headers,
        })
        .catch(TypesafeBaseApi.processError);
    },
    patch: (url, params: Payload) => {
      return TypesafeBaseApi.httpClient
        .request({
          method: 'PATCH',
          path: url,
          query: params.query,
          body: params.data,
          headers: params.headers,
        })
        .catch(TypesafeBaseApi.processError);
    },
    delete: (url, params: Payload) => {
      return TypesafeBaseApi.httpClient
        .request({
          method: 'DELETE',
          path: url,
          query: params.query,
          headers: params.headers,
        })
        .catch(TypesafeBaseApi.processError);
    },
  };

  private static processError(err: unknown): never {
    toast.error(getAxiosErrorText(err, true));
    throw err;
  }
}
