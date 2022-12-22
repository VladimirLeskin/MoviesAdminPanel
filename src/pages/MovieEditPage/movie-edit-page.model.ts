import {makeAutoObservable, runInAction} from 'mobx';
import {toast} from 'react-toastify';

import {IEditedMovieInfo} from './types';
import MoviesApi from '../../api/Movies';
import {IMovieGenre, IMovieInfoDto} from '../../api/dto/MovieDto';
import Config from '../../entries/Config';

const emptyMovie: IEditedMovieInfo = {
  adult: false,
  country: '',
  descriptions: [{lang: 'ru'}],
  images: [],
  genres: [],
  imdb_id: '',
  tmdb_id: '',
  original_title: '',
};

export class MovieEditPageModel {
  private _movieInfo: IEditedMovieInfo = emptyMovie;
  private _isLoading = false;
  public genresDescription: IMovieGenre[] = [];

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public async load(movieId?: string) {
    if (!this.genresDescription.length) {
      MoviesApi.getGenresDescriptions().then(resp => {
        runInAction(() => {
          this.genresDescription = resp.data.items;
        });
      });
    }

    if (movieId) {
      try {
        this.isLoading = true;
        const data = await MoviesApi.getMovieInfo(movieId);
        if (data.data) {
          const levelInfoDto = data.data;
          this.movieInfo = MovieEditPageModel.movieDtoToMovieInfo(levelInfoDto);
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  public updateMovie(info: IEditedMovieInfo) {
    this.movieInfo = info;
  }

  public async save() {
    const validationErrors = this.validate();
    if (validationErrors.length) {
      toast.error(validationErrors.join(', '));
      return;
    }

    let toastId;
    const toastOptions = {isLoading: false, autoClose: 10000, closeButton: true};

    try {
      const movieInfo = this.movieInfo;
      this.isLoading = true;
      toastId = toast.loading('Сохраняем');

      const response = await MoviesApi.createMovieInfo({
        id: movieInfo.id,
        original_title: movieInfo.original_title,
        descriptions: movieInfo.descriptions.reduce((acc, d) => {
          const {lang, ...descr} = d;
          if (descr.title) {
            acc[lang] = descr;
          }
          return acc;
        }, {}),
        adult: movieInfo.adult,
        genres: movieInfo.genres,
        images: movieInfo.images.map(img => ({...img, name: img.src, content: img.content})),
        release_date_ts: movieInfo.release_date && movieInfo.release_date?.getTime() / 1000,
        country: movieInfo.country,
        tmdb_id: +String(movieInfo.tmdb_id) || undefined,
        imdb_id: movieInfo.imdb_id,
      });

      toast.update(toastId, {type: 'success', render: 'Сохранено', ...toastOptions});
      if (response.data) {
        this.movieInfo = MovieEditPageModel.movieDtoToMovieInfo(response.data);
      }
    } catch (err: any) {
      toast.update(toastId, {type: 'error', render: 'Ошибка сохранения', ...toastOptions});
    } finally {
      this.isLoading = false;
    }
  }

  get movieInfo(): IEditedMovieInfo {
    return this._movieInfo;
  }

  set movieInfo(value: IEditedMovieInfo) {
    this._movieInfo = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  private static movieDtoToMovieInfo(movieInfoDto: IMovieInfoDto): IEditedMovieInfo {
    return {
      id: movieInfoDto.id,
      original_title: movieInfoDto.original_title,
      imdb_id: movieInfoDto.imdb_id,
      tmdb_id: movieInfoDto.tmdb_id?.toString(),
      country: movieInfoDto.country,
      release_date:
        movieInfoDto.release_date_ts !== undefined ? new Date(movieInfoDto.release_date_ts * 1000) : undefined,
      genres: movieInfoDto.genres ?? [],
      adult: movieInfoDto.adult ?? false,
      images: movieInfoDto.images.map(img => ({
        ...img,
        src: `${Config.imagesUrl}/${img.name}`,
        content: undefined,
      })),
      descriptions: Object.entries(movieInfoDto.descriptions).map(([lang, description]) => ({
        lang,
        ...description,
      })),
    };
  }

  private validate(): string[] {
    const errors: string[] = [];
    if (!this.movieInfo.imdb_id) {
      errors.push('imdb_id пусто');
    }
    for (let i = 0; i < this.movieInfo.descriptions.length; i++) {
      const description = this.movieInfo.descriptions[i];
      if (!description.title) {
        errors.push(`Отсутствует название для языка: ${description.lang}`);
      }
    }
    return errors;
  }
}
