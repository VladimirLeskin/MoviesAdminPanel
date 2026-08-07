import {IListPagination} from '../../models/ItemsListModel';

export type TTmdbMediaType = 'movie' | 'tv';

export interface ITmdbDiscoverWidgetFilter {
  type?: TTmdbMediaType;
  popularity?: number;
  genres?: number[];
  date_from?: string;
  date_to?: string;
  countries?: string[];
}

export interface TmdbDiscoverWidgetParams {
  pagination?: IListPagination;
  filter?: ITmdbDiscoverWidgetFilter;
}
