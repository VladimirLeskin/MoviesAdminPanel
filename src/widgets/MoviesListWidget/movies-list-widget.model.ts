import {makeObservable} from 'mobx';
import {IMovieListItem} from '../../api/dto/MovieDto';
import {IApiEndPoints, ItemsListModel} from '../../models/ItemsListModel';
import {TypesafeMovies} from '../../api/TypesafeMovies';

interface IMovieFilter {
  search?: string;
}

export class MoviesListWidgetModel extends ItemsListModel<IMovieListItem, IMovieFilter> {
  constructor() {
    super();
    makeObservable(this, MoviesListWidgetModel.getMoviesListMobxAnnotations());
  }

  protected apiEndPoints: IApiEndPoints<IMovieListItem, IMovieFilter> = {
    load: v =>
      TypesafeMovies.getMovies({...v?.filter, ...v?.pagination, sort: v?.sortState}).then(response => {
        return {
          ...response,
          data: {
            total: response.data.total,
            items: response.data.items.map(dto => ({
              id: dto.movie_id,
              tvSeries: dto.tv_series,
              status: dto.status,
              movie_id: dto.movie_id,
              original_title: dto.original_title,
              title: dto.descriptions.find(d => d.lang === 'ru')?.title ?? '',
              genres: dto.genres,
              countries: dto.countries,
              date: dto.date ? new Date(dto.date) : undefined,
              images: dto.images.map(img => ({...img, id: img.id})),
            })),
          },
        };
      }),
    delete: () => Promise.reject(new Error('not implemented')),
  };

  private static getMoviesListMobxAnnotations() {
    return {
      ...MoviesListWidgetModel.getMobxBaseAnnotations(),
    };
  }
}
