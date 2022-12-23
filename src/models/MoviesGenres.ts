import {makeAutoObservable, runInAction} from 'mobx';
import {IMovieGenre} from '../api/dto/MovieDto';
import MoviesApi from '../api/Movies';

class MoviesGenres {
  private _genres?: IMovieGenre[] = undefined;
  private _isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public get genres(): Record<number, IMovieGenre> {
    if (!this._genres && !this._isLoading) {
      this._isLoading = true;
      MoviesApi.getGenresDescriptions()
        .then(resp => {
          this._genres = resp.data.items;
        })
        .catch(() => {})
        .finally(() => {
          runInAction(() => {
            this._isLoading = false;
          });
        });
      return [];
    } else {
      return (
        this._genres?.reduce((acc, cur) => {
          acc[cur.genre_id] = cur;
          return acc;
        }, {}) ?? {}
      );
    }
  }
}

export const MOVIES_GENRES = new MoviesGenres();
