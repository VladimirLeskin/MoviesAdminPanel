import {useQueryParams as baseUseQueryParams} from 'use-query-params';
import {IQueryConfig} from 'src/utils/queryParams';

export function useQueryParams<T extends object>(queryConfig: IQueryConfig<T>) {
  return baseUseQueryParams<IQueryConfig<T>>(queryConfig);
}
