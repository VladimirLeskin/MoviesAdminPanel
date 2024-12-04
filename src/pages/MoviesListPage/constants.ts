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

export const moviesListFiltersQueryConfig: IQueryConfig<IMovieFilter> = {
  search: QueryParams.string(),
  tvSeries: QueryParams.boolean(),
  genres: QueryParams.arrayOfNumbers(),
  countries: QueryParams.arrayOfString(),
};
