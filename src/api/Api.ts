/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SetUserRolesRequest {
  roles: string[];
}

export interface UserListItem {
  /** @format int32 */
  id: number;
  login?: string;
  firstname?: string;
  lastname?: string;
  assignedRoles: string[];
}

export interface UpdateRoleRequest {
  permissions: string[];
  childRoles: string[];
}

export interface RoleListItem {
  name: string;
  description?: string;
  permissions: string[];
  childRoles: string[];
  effectivePermissions: string[];
}

export interface SetRolePermissionsRequest {
  permissions: string[];
}

export interface Description {
  lang: string;
  title: string;
  description?: string;
  tagline?: string;
}

export interface MovieDetailsImage {
  /** @format int32 */
  id: number;
  name: string;
  content?: string;
}

export interface MovieSaveImage {
  content?: string;
}

export interface MovieSaveInfo {
  new_images: MovieSaveImage[];
  tv_series: boolean;
  imdb_id: string;
  /** @format int32 */
  tmdb_id?: number;
  countries: string[];
  genres: number[];
  original_title: string;
  /** @format int64 */
  release_date_ts?: number;
  /** @format int64 */
  end_date_ts?: number;
  status: 'ACTIVE' | 'MODERATION';
  images: MovieDetailsImage[];
  descriptions: Description[];
}

export interface MovieDetails {
  /** @format int32 */
  id: number;
  tv_series: boolean;
  imdb_id: string;
  /** @format int32 */
  tmdb_id?: number;
  countries: string[];
  genres: number[];
  original_title: string;
  /** @format int64 */
  release_date_ts?: number;
  /** @format int64 */
  end_date_ts?: number;
  status: 'ACTIVE' | 'MODERATION';
  images: MovieDetailsImage[];
  descriptions: Description[];
}

export interface LevelDescription {
  lang: string;
  title: string;
  description: string;
}

export interface LevelInfoSaveRequest {
  image?: LevelSaveImage;
  questions: LevelSaveRequestQuestion[];
  descriptions: LevelDescription[];
  type: 'COUNT' | 'TIME';
  /** @format int32 */
  timeForEach?: number;
  /** @format int32 */
  totalTime?: number;
  active: boolean;
}

export interface LevelSaveImage {
  /** @format int32 */
  id?: number;
  content?: string;
}

export interface LevelSaveRequestQuestion {
  /** @format int32 */
  imageId: number;
  variants: number[];
}

export interface LevelImage {
  /** @format int32 */
  id: number;
  name: string;
}

export interface LevelInfo {
  /** @format int32 */
  id: number;
  image?: LevelImage;
  questions: Question[];
  descriptions: LevelDescription[];
  type: 'COUNT' | 'TIME';
  /** @format int32 */
  timeForEach?: number;
  /** @format int32 */
  totalTime?: number;
  active: boolean;
}

export interface Question {
  /** @format int32 */
  correctId: number;
  /** @format int32 */
  imageId: number;
  imagePath: string;
  variants: Variant[];
}

export interface Variant {
  /** @format int32 */
  id: number;
  original_title: string;
  titles: VariantDescription[];
  /** @format date-time */
  date: string;
}

export interface VariantDescription {
  lang: string;
  title: string;
  description?: string;
}

export interface Country {
  code: string;
  names: CountryName[];
}

export interface CountryName {
  lang: string;
  name: string;
}

export interface AssignRoleRequest {
  role: string;
}

export interface UpdateProgressRequest {
  /** @format int32 */
  levelId: number;
  /** @format int32 */
  correctAnswers: number;
  /** @format int32 */
  totalTime: number;
}

export interface UpdateProgressResponse {
  /** @format int32 */
  score: number;
  /** @format int32 */
  maxScore: number;
  /** @format int32 */
  rate: number;
  /** @format int32 */
  bestScore: number;
  /** @format int32 */
  bestRate: number;
  /** @format int32 */
  maxRate: number;
}

export interface TmdbImportItem {
  /** @format int32 */
  tmdb_id: number;
  type: 'movie' | 'tv';
}

export interface TmdbImportRequest {
  items: TmdbImportItem[];
}

export interface TmdbImportFailure {
  /** @format int32 */
  tmdb_id: number;
  type: 'movie' | 'tv';
  reason: 'FETCH_FAILED' | 'ALREADY_EXISTS';
  imdb_id?: string;
  message?: string;
}

export interface TmdbImportResponse {
  /** @format int32 */
  created: number;
  /** @format int32 */
  updated: number;
  /** @format int32 */
  failToUpdate: number;
  /** @format int32 */
  failToCreate: number;
  failures: TmdbImportFailure[];
}

export interface MovieCreateManyResponse {
  /** @format int32 */
  created: number;
  /** @format int32 */
  updated: number;
  /** @format int32 */
  failToUpdate: number;
  /** @format int32 */
  failToCreate: number;
}

export interface MoviesImageLoadRequest {
  moviesIds: number[];
  /** @format int32 */
  minImageWidth?: number;
}

export interface MovieImagesStats {
  status: 'SUCCESS' | 'FAIL';
  /** @format int32 */
  imagesCount: number;
}

export interface MoviesImageLoadResponse {
  movies: Record<string, MovieImagesStats>;
}

export interface RegisterRequest {
  login: string;
  password: string;
}

export interface LoginCheckResponse {
  success: boolean;
  error?: 'LOGIN_ALREADY_IN_USE' | 'LOGIN_VALIDATION_TIP';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserTokens {
  accessToken: string;
  /** @format int64 */
  accessTokenExpirationTs: number;
  refreshToken: string;
  /** @format int64 */
  refreshTokenExpirationTs: number;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: UserTokens;
}

export interface User {
  /** @format int32 */
  id: number;
  login?: string;
  isGuest: boolean;
  firstname?: string;
  lastname?: string;
  isExternal: boolean;
  roles: string[];
  permissions: string[];
}

export interface YaGamesAuthParams {
  extId: string;
  oldToken?: string;
  signature: string;
}

export interface SignParam {
  key: string;
  value?: string;
}

export interface VkAuthParams {
  extId: string;
  oldToken?: string;
  sign: string;
  signParams: SignParam[];
  userInfo: VkUserInfo;
}

export interface VkUserInfo {
  firstname: string;
  lastname: string;
}

export interface ListResponseUserListItem {
  /** @format int32 */
  total: number;
  items: UserListItem[];
}

export interface UserProgress {
  /** @format int32 */
  levelId: number;
  /** @format int32 */
  score: number;
  /** @format int32 */
  rate: number;
  /** @format date-time */
  date?: string;
}

export interface TmdbDiscoverItem {
  /** @format int32 */
  tmdb_id: number;
  type: 'movie' | 'tv';
  title: string;
  original_title: string;
  overview?: string;
  /** @format double */
  popularity: number;
  release_date?: string;
  end_date?: string;
  genre_ids: number[];
  countries: string[];
  poster_path?: string;
  imdb_id: string;
}

export interface TmdbDiscoverResponse {
  /** @format int32 */
  page: number;
  /** @format int32 */
  total_pages: number;
  /** @format int32 */
  total_results: number;
  results: TmdbDiscoverItem[];
}

export interface ListResponseRoleListItem {
  /** @format int32 */
  total: number;
  items: RoleListItem[];
}

export interface ListResponsePermissionListItem {
  /** @format int32 */
  total: number;
  items: PermissionListItem[];
}

export interface PermissionListItem {
  name: string;
  description?: string;
}

export interface Image {
  /** @format int32 */
  id: number;
  path: string;
}

export interface ListResponseMovieListItem {
  /** @format int32 */
  total: number;
  items: MovieListItem[];
}

export interface MovieListItem {
  /** @format int32 */
  movie_id: number;
  tv_series: boolean;
  status: 'ACTIVE' | 'MODERATION';
  original_title: string;
  descriptions: Description[];
  genres: number[];
  countries: string[];
  /** @format date-time */
  date?: string;
  images: Image[];
}

export interface LevelListItem {
  /** @format int32 */
  id: number;
  /** @format int32 */
  timeForEach?: number;
  /** @format int32 */
  totalTime?: number;
  type: 'COUNT' | 'TIME';
  active: boolean;
  previewImageName?: string;
  titles: LevelListItemTitle[];
  /** @format int32 */
  questions_count: number;
}

export interface LevelListItemTitle {
  lang: string;
  title: string;
  description?: string;
}

export interface ListResponseLevelListItem {
  /** @format int32 */
  total: number;
  items: LevelListItem[];
}

export interface Genre {
  /** @format int32 */
  id: number;
  names: GenreDescription[];
}

export interface GenreDescription {
  lang: string;
  name: string;
}

export interface ListResponseGenre {
  /** @format int32 */
  total: number;
  items: Genre[];
}

export interface ListResponseCountry {
  /** @format int32 */
  total: number;
  items: Country[];
}

import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** request path */
  path: string;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  format?: ResponseType;
}

export class HttpClient {
  public instance: AxiosInstance;
  private format?: ResponseType;

  constructor({format, ...axiosConfig}: ApiConfig = {}) {
    this.instance = axios.create({...axiosConfig, baseURL: axiosConfig.baseURL || 'http://movies-backend:8080'});
    this.format = format;
  }

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  public request = async <T = any, _E = any>({
    path,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const requestParams = this.mergeRequestParams(params);
    const responseFormat = format || this.format || undefined;

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

export type ApiControllers = usersController &
  rolesController &
  moviesController &
  levelsController &
  countriesController &
  userProgressController &
  tmdbController &
  authController &
  questionsController &
  permissionsController &
  genresController;

type usersController = {
  '/movies-api/v2/users/{id}/roles': {
    put: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: SetUserRolesRequest;
      },
      UserListItem,
    ];
    post: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: AssignRoleRequest;
      },
      UserListItem,
    ];
  };

  '/movies-api/v2/users': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      ListResponseUserListItem,
    ];
  };

  '/movies-api/v2/users/{id}': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      UserListItem,
    ];
  };

  '/movies-api/v2/users/{id}/roles/{roleName}': {
    delete: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      UserListItem,
    ];
  };
};
type rolesController = {
  '/movies-api/v2/roles/{name}': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      RoleListItem,
    ];
    put: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: UpdateRoleRequest;
      },
      RoleListItem,
    ];
  };

  '/movies-api/v2/roles/{name}/permissions': {
    put: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: SetRolePermissionsRequest;
      },
      RoleListItem,
    ];
  };

  '/movies-api/v2/roles': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      ListResponseRoleListItem,
    ];
  };
};
type moviesController = {
  '/movies-api/v2/movies/{id}': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      MovieDetails,
    ];
    put: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: MovieSaveInfo;
      },
      MovieDetails,
    ];
  };

  '/movies-api/v2/movies': {
    get: [
      {
        query: {
          search?: string;
          /** @format int32 */
          page?: number;
          /** @format int32 */
          pageSize?: number;
          sort?: string[];
          sortLang?: string;
          tvSeries?: boolean;
          genres?: number[];
          countries?: string[];
          status?: 'ACTIVE' | 'MODERATION';
        };
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      ListResponseMovieListItem,
    ];
    post: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: MovieSaveInfo;
      },
      MovieDetails,
    ];
  };

  '/movies-api/v2/movies/upload': {
    post: [
      {
        query: {
          override?: boolean;
        };
        headers: {'Content-Type': 'multipart/form-data'} & {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: {
          /** @format binary */
          file: File;
        };
      },
      MovieCreateManyResponse,
    ];
  };

  '/movies-api/v2/movies/load-images': {
    post: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: MoviesImageLoadRequest;
      },
      MoviesImageLoadResponse,
    ];
  };
};
type levelsController = {
  '/movies-api/v2/levels/{id}': {
    get: [{}, LevelInfo];
    put: [
      {
        data: LevelInfoSaveRequest;
      },
      LevelInfo,
    ];
    delete: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      void,
    ];
  };

  '/movies-api/v2/levels': {
    get: [
      {
        query: {
          /** @format int32 */
          page?: number;
          /** @format int32 */
          pageSize?: number;
        };
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      ListResponseLevelListItem,
    ];
    post: [
      {
        data: LevelInfoSaveRequest;
      },
      LevelInfo,
    ];
  };

  '/movies-api/v2/levels/{id}/publish': {
    post: [
      {
        query: {
          active: boolean;
        };
      },
      void,
    ];
  };
};
type countriesController = {
  '/movies-api/v2/countries/{code}': {
    get: [{}, Country];
    put: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: Country;
      },
      Country,
    ];
    delete: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      void,
    ];
  };

  '/movies-api/v2/countries': {
    get: [{}, ListResponseCountry];
    post: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: Country;
      },
      Country,
    ];
  };
};
type userProgressController = {
  '/movies-api/v2/user-progress': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      UserProgress[],
    ];
    post: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: UpdateProgressRequest;
      },
      UpdateProgressResponse,
    ];
  };
};
type tmdbController = {
  '/movies-api/v2/tmdb/import': {
    post: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: TmdbImportRequest;
      },
      TmdbImportResponse,
    ];
  };

  '/movies-api/v2/tmdb/discover': {
    get: [
      {
        query: {
          type: 'movie' | 'tv';
          query?: string;
          /** @format double */
          popularity?: number;
          genres?: number[];
          date_from?: string;
          date_to?: string;
          countries?: string[];
          sort_field?: string;
          sort_order?: string;
          /** @format int32 */
          page?: number;
        };
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      TmdbDiscoverResponse,
    ];
  };
};
type authController = {
  '/movies-api/v2/auth/register': {
    post: [
      {
        data: RegisterRequest;
      },
      LoginCheckResponse,
    ];
  };

  '/movies-api/v2/auth/refresh_token': {
    post: [
      {
        data: RefreshTokenRequest;
      },
      UserTokens,
    ];
  };

  '/movies-api/v2/auth/login': {
    post: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
        data: LoginRequest;
      },
      LoginResponse,
    ];
  };

  '/movies-api/v2/auth/auth_as_ya_games_user': {
    post: [
      {
        data: YaGamesAuthParams;
      },
      LoginResponse,
    ];
  };

  '/movies-api/v2/auth/auth_as_vk_user': {
    post: [
      {
        data: VkAuthParams;
      },
      LoginResponse,
    ];
  };

  '/movies-api/v2/auth/auth_as_guest': {
    post: [{}, LoginResponse];
  };

  '/movies-api/v2/auth': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      User,
    ];
  };

  '/movies-api/v2/auth/logout': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      void,
    ];
  };

  '/movies-api/v2/auth/check_login': {
    get: [
      {
        query: {
          login: string;
        };
      },
      LoginCheckResponse,
    ];
  };
};
type questionsController = {
  '/movies-api/v2/questions': {
    get: [
      {
        query: {
          movie_type?: 'MOVIE' | 'TV_SERIES';
          /** @format int32 */
          limit?: number;
          /** @format int32 */
          variants?: number;
          genres?: number[];
          countries?: string[];
        };
      },
      Question[],
    ];
  };
};
type permissionsController = {
  '/movies-api/v2/permissions': {
    get: [
      {
        headers: {
          /** Bearer {access_token} */
          Authorization: string;
        };
      },
      ListResponsePermissionListItem,
    ];
  };
};
type genresController = {
  '/movies-api/v2/genres': {
    get: [{}, ListResponseGenre];
  };
};
