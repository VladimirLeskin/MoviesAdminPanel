import {makeAutoObservable} from 'mobx';
import {IMovieDto} from '../../api/dto/MovieDto';
import Config from '../../entries/Config';
import MoviesApi from '../../api/Movies';

interface IMovieFilter {
  search?: string;
}

export class MoviesPickerModel {
  private _movies: IMovieDto[] = [];
  private _moviesLoading = false;
  public filter: IMovieFilter = {};

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public get movies() {
    return this._movies.map(mov => ({
      ...mov,
      images: mov.images.slice(),
    }));
  }

  public async loadMovies() {
    this.moviesLoading = true;
    const response = await MoviesApi.getMovies({search: this.filter.search});
    this._movies = response.data.items;
    this.moviesLoading = false;
  }

  public onFilterChanged(filter: IMovieFilter) {
    this.filter = filter;
    this.loadMovies();
  }

  public get moviesLoading(): boolean {
    return this._moviesLoading;
  }

  public set moviesLoading(value: boolean) {
    this._moviesLoading = value;
  }
}
