import {makeObservable} from 'mobx';

import {TmdbDiscoverItem} from '../../api/Api';
import {TmdbApi} from '../../api/TmdbApi';
import {IApiEndPoints, ItemsListModel} from '../../models/ItemsListModel';
import {ITmdbDiscoverWidgetFilter} from './types';

export type ITmdbDiscoverListItem = TmdbDiscoverItem & {id: number};

export class TmdbDiscoverWidgetModel extends ItemsListModel<ITmdbDiscoverListItem, ITmdbDiscoverWidgetFilter> {
  constructor() {
    super();
    makeObservable(this, TmdbDiscoverWidgetModel.getTmdbDiscoverMobxAnnotations());
  }

  protected apiEndPoints: IApiEndPoints<ITmdbDiscoverListItem, ITmdbDiscoverWidgetFilter> = {
    load: payload => {
      const filter = payload?.filter ?? {};
      const page = (payload?.pagination?.page ?? 0) + 1;

      return TmdbApi.discover({
        type: filter.type ?? 'movie',
        query: filter.query?.trim() || undefined,
        popularity: filter.popularity,
        genres: filter.genres,
        date_from: filter.date_from,
        date_to: filter.date_to,
        countries: filter.countries,
        sort_field: payload?.sortState?.[0]?.field,
        sort_order: payload?.sortState?.[0]?.order,
        page,
      }).then(response => ({
        ...response,
        data: {
          total: response.data.total_results,
          items: response.data.results.map(item => ({
            ...item,
            id: item.tmdb_id,
          })),
        },
      }));
    },
    delete: () => Promise.reject(new Error('not implemented')),
  };

  private static getTmdbDiscoverMobxAnnotations() {
    return {
      ...TmdbDiscoverWidgetModel.getMobxBaseAnnotations(),
    };
  }
}
