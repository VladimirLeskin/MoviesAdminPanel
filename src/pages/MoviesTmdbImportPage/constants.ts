import {IListPagination} from '../../models/ItemsListModel';
import {ITmdbDiscoverWidgetFilter} from '../../widgets/TmdbDiscoverWidget/types';
import {IQueryConfig, QueryParams} from '../../utils/queryParams';

export const tmdbDiscoverPaginationQueryConfig: IQueryConfig<IListPagination> = {
  page: QueryParams.numeric(0),
  pageSize: QueryParams.numeric(20),
};

function ensureTmdbType(str?: string): str is ITmdbDiscoverWidgetFilter['type'] {
  return str === 'movie' || str === 'tv';
}

export const tmdbDiscoverFiltersQueryConfig: IQueryConfig<ITmdbDiscoverWidgetFilter> = {
  type: {
    decode: str => (ensureTmdbType(str) ? str : 'movie'),
    encode: str => str ?? 'movie',
  },
  popularity: QueryParams.numeric(),
  genres: QueryParams.arrayOfNumbers(),
  countries: QueryParams.arrayOfString(),
  date_from: QueryParams.string(),
  date_to: QueryParams.string(),
};
