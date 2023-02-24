import {action, makeObservable} from 'mobx';
import {IMovieListItem} from '../../api/dto/MovieDto';
import MoviesApi from '../../api/Movies';
import {IApiEndPoints, IListPagination, ItemsListModel} from '../../models/ItemsListModel';

interface IMovieFilter {
  search?: string;
}

export class MoviesListWidgetModel extends ItemsListModel<IMovieListItem, IMovieFilter> {
  private inited = false;

  constructor() {
    super();
    makeObservable(this, MoviesListWidgetModel.getMoviesListMobxAnnotations());
  }

  public override get items() {
    return this._items.map(mov => ({
      ...mov,
      images: mov.images.slice(),
    }));
  }

  public init() {
    if (!this.inited) {
      this.loadItems({filter: this.filter, pagination: this.pagination});
    }
    this.inited = true;
  }

  public onFilterChanged(filter: IMovieFilter) {
    this.filter = filter;
    this.pagination = {...this.pagination, page: 0};
    this.loadItems({filter, pagination: this.pagination});
  }

  public onPaginationChanged(pagination: IListPagination) {
    this.pagination = pagination;
    this.loadItems({filter: this.filter, pagination});
  }

  protected apiEndPoints: IApiEndPoints<IMovieListItem, IMovieFilter> = {
    load: v =>
      MoviesApi.getMovies({...v?.filter, ...v?.pagination}).then(data => {
        return {
          ...data,
          data: {
            ...data.data,
            items: data.data.items.map(dto => ({
              id: dto.movie_id,
              movie_id: dto.movie_id,
              original_title: dto.original_title,
              title: dto.title,
              genres: dto.genres,
              countries: dto.countries,
              date: new Date(dto.date),
              images: dto.images,
            })),
          },
        };
      }),
    delete: () => Promise.reject(new Error('not implemented')),
  };

  private static getMoviesListMobxAnnotations() {
    return {
      ...MoviesListWidgetModel.getMobxBaseAnnotations(),
      init: action.bound,
      onFilterChanged: action.bound,
      onPaginationChanged: action.bound,
    };
  }
}
