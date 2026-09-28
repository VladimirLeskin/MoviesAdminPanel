import {AxiosResponse} from 'axios';
import {toast} from 'react-toastify';
import qs from 'query-string';
import {ApiControllers, HttpClient} from './Api';
import {getAxiosErrorText} from './stdAxiosErrorHandler';
import Config from '../entries/Config';

type Method = 'get' | 'delete' | 'post' | 'put' | 'patch' | 'head' | 'options';

interface Payload {
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  data?: unknown;
  route?: Record<string, string>;
}

type Controller = {
  [path: string]: Partial<Record<Method, [Payload, unknown]>>;
};

type ExtractRoutesByMethod<TController extends Controller, TMethod extends Method> = {
  [TRoute in keyof TController]: TController[TRoute][TMethod] extends Array<unknown> ? TRoute : never;
}[keyof TController];

type RouteParams<TRoute> = TRoute extends `${string}{${infer TParam}}${infer TRest}`
  ? {[K in TParam | keyof RouteParams<TRest>]: string}
  : {};

type RequestRouteParams<TRoute> =
  {} extends RouteParams<TRoute>
    ? {}
    : {
        route: RouteParams<TRoute>;
      };

type ExtractRequestType<TController extends Controller, TRoute extends keyof TController, TMethod extends Method> = {
  request: TController[TRoute][TMethod] extends [Payload, unknown]
    ? TController[TRoute][TMethod][0] & RequestRouteParams<TRoute>
    : never;
  response: TController[TRoute][TMethod] extends [Payload, unknown] ? TController[TRoute][TMethod][1] : never;
};

type Transport<TController extends Controller> = {
  [TMethod in Method]: <TRoute extends ExtractRoutesByMethod<TController, TMethod>>(
    url: TRoute,
    params: ExtractRequestType<TController, TRoute, TMethod>['request']
  ) => Promise<AxiosResponse<ExtractRequestType<TController, TRoute, TMethod>['response']>>;
};

export class TypesafeBaseApi {
  private static httpClient: HttpClient = new HttpClient({
    format: 'json',
    baseURL: Config.apiOrigin || '/',
    paramsSerializer: params => {
      return qs.stringify(params, {arrayFormat: 'comma'});
    },
  });

  private static request(url: string, method: Method, params: Payload) {
    let preparedUrl = url;
    url.match(/\{([^}]*)}/g)?.forEach(match => {
      preparedUrl = preparedUrl.replace(match, params.route?.[match.replace(/{(.*)}/, '$1')] ?? match);
    });

    return TypesafeBaseApi.httpClient
      .request({
        method,
        path: preparedUrl,
        query: params.query,
        body: params.data,
        headers: {'Content-Type': 'application/json', ...params.headers},
      })
      .catch(TypesafeBaseApi.processError);
  }

  protected static transport: Transport<ApiControllers> = {
    get: (url, params) => TypesafeBaseApi.request(url, 'get', params),
    post: (url, params) => TypesafeBaseApi.request(url, 'post', params),
    put: (url, params) => TypesafeBaseApi.request(url, 'put', params),
    patch: (url, params) => TypesafeBaseApi.request(url, 'patch', params),
    delete: (url, params) => TypesafeBaseApi.request(url, 'delete', params),
    options: (url, params) => TypesafeBaseApi.request(url, 'options', params),
    head: (url, params) => TypesafeBaseApi.request(url, 'head', params),
  };

  private static processError(err: unknown): never {
    toast.error(getAxiosErrorText(err, true));
    throw err;
  }
}
