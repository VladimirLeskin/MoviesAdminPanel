import {IListPagination} from '../../models/ItemsListModel';
import {ISortState} from '../../type';

export type TTmdbMediaType = 'movie' | 'tv';

export interface ITmdbDiscoverWidgetFilter {
  type?: TTmdbMediaType;
  query?: string;
  popularity?: number;
  genres?: number[];
  date_from?: string;
  date_to?: string;
  countries?: string[];
}

export interface TmdbDiscoverWidgetParams {
  pagination?: IListPagination;
  filter?: ITmdbDiscoverWidgetFilter;
  sortState?: ISortState[];
}
