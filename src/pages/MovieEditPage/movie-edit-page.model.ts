import {makeAutoObservable} from 'mobx';
import {IEditedMovieInfo} from './types';
import MoviesApi from '../../api/Movies';
import {IMovieInfoDto} from '../../api/dto/MovieDto';
import Config from '../../entries/Config';

const emptyMovie: IEditedMovieInfo = {
  adult: false,
  country: '',
  descriptions: [{lang: 'ru'}],
  images: [],
  imdb_id: '',
  tmdb_id: '',
  original_title: '',
};

export class MovieEditPageModel {
  private _movieInfo: IEditedMovieInfo = emptyMovie;
  private _isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public async load(movieId?: string) {
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

  public addDescription() {
    this.movieInfo.descriptions.push({lang: 'ru'});
  }

  public async save() {
    const movieInfo = this.movieInfo;
    this.isLoading = true;
    try {
      const response = await MoviesApi.createMovieInfo({
        id: movieInfo.id,
        original_title: movieInfo.original_title,
        descriptions: movieInfo.descriptions.reduce((acc, d) => {
          const {lang, ...descr} = d;
          acc[lang] = descr;
          return acc;
        }, {}),
        adult: movieInfo.adult,
        images: movieInfo.images.map(img => ({...img, name: img.src, content: img.content})),
        release_date_ts: movieInfo.release_date && movieInfo.release_date?.getTime() / 1000,
        country: movieInfo.country,
        tmdb_id: movieInfo.tmdb_id,
        imdb_id: movieInfo.imdb_id,
      });

      if (response.data) {
        this.movieInfo = MovieEditPageModel.movieDtoToMovieInfo(response.data);
      }
    } catch (err: any) {
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
      tmdb_id: movieInfoDto.tmdb_id,
      country: movieInfoDto.country,
      release_date:
        movieInfoDto.release_date_ts !== undefined ? new Date(movieInfoDto.release_date_ts * 1000) : undefined,
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
}
