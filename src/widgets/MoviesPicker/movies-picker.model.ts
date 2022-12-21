import {makeAutoObservable} from 'mobx';
import {IMovieDto} from '../../api/dto/MovieDto';
import MoviesApi from '../../api/Movies';

interface IMovieFilter {
  search?: string;
}

interface IMoviePagination {
  page?: number; // from 0
  pageSize: number;
}

export class MoviesPickerModel {
  private _movies: IMovieDto[] = [];
  private _moviesLoading = false;
  public filter: IMovieFilter = {};
  public pagination: IMoviePagination = {pageSize: 20};
  public total: number = 0;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public get movies() {
    return this._movies.map(mov => ({
      ...mov,
      images: mov.images.slice(),
    }));
  }

  private lastRequestId?: Symbol;

  public async loadMovies() {
    this.moviesLoading = true;
    const currentRequestId = Symbol();
    this.lastRequestId = currentRequestId;
    const response = await MoviesApi.getMovies({search: this.filter.search, ...this.pagination});
    if (currentRequestId === this.lastRequestId) {
      this._movies = response.data.items;
      this.total = response.data.meta.totalCount;
      this.pagination.pageSize = response.data.meta.perPage;
      this.moviesLoading = false;
    }
  }

  public onFilterChanged(filter: IMovieFilter) {
    this.filter = filter;
    this.loadMovies();
  }

  public onPaginationChanged(pagination: IMoviePagination) {
    this.pagination = pagination;
    this.loadMovies();
  }

  public get moviesLoading(): boolean {
    return this._moviesLoading;
  }

  public set moviesLoading(value: boolean) {
    this._moviesLoading = value;
  }
}
