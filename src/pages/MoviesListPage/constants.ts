import {IListPagination} from '../../models/ItemsListModel';
import {IMovieFilter} from '../../widgets/MoviesListWidget/components/filter/MoviesListFilter';
import {IQueryConfig, QueryParams} from '../../utils/queryParams';
import {ISortState} from '../../type';

export const moviesListPaginationQueryConfig: IQueryConfig<IListPagination> = {
  page: QueryParams.numeric(),
  pageSize: QueryParams.numeric(50),
};

export const moviesListSortQueryConfig: IQueryConfig<{sort?: ISortState[]}> = {
  sort: QueryParams.sort(),
};

function ensureMovieStatus(str?: string): str is IMovieFilter['status'] {
  return new Set<string | undefined>(['ACTIVE', 'MODERATION']).has(str);
}

export const moviesListFiltersQueryConfig: IQueryConfig<IMovieFilter> = {
  search: QueryParams.string(),
  tvSeries: QueryParams.boolean(),
  genres: QueryParams.arrayOfNumbers(),
  countries: QueryParams.arrayOfString(),
  status: {
    decode: str => (ensureMovieStatus(str) ? str : undefined),
    encode: str => str,
  },
};
