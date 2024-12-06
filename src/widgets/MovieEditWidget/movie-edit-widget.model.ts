import {makeObservable} from 'mobx';
import {IEditedMovieInfo} from './types';
import MoviesApi from '../../api/Movies';
import {IMovieInfoDto} from '../../api/dto/MovieDto';
import {EntityEditorModel} from '../../models/EntityEditorModel';
import {TypesafeMovies} from '../../api/TypesafeMovies';
import {MovieDetails} from '../../api/Api';

const emptyMovie: IEditedMovieInfo = {
  tv_series: false,
  countries: [],
  descriptions: [{lang: 'ru'}],
  images: [],
  genres: [],
  imdb_id: '',
  tmdb_id: '',
  original_title: '',
};

export class MovieEditWidgetModel extends EntityEditorModel<IEditedMovieInfo> {
  constructor() {
    super();
    this.data = emptyMovie;
    makeObservable(this, MovieEditWidgetModel.getMobxBaseAnnotations());
  }

  private static movieDtoToMovieInfo(movieInfoDto: MovieDetails): IEditedMovieInfo {
    return {
      id: movieInfoDto.id,
      tv_series: movieInfoDto.tv_series,
      original_title: movieInfoDto.original_title,
      imdb_id: movieInfoDto.imdb_id,
      tmdb_id: movieInfoDto.tmdb_id?.toString(),
      countries: movieInfoDto.countries,
      release_date: movieInfoDto.release_date_ts !== undefined ? new Date(movieInfoDto.release_date_ts) : undefined,
      end_date: movieInfoDto.end_date_ts !== undefined ? new Date(movieInfoDto.end_date_ts) : undefined,
      genres: movieInfoDto.genres ?? [],
      images: movieInfoDto.images.map(img => ({
        ...img,
        src: img.name,
        content: undefined,
      })),
      descriptions: movieInfoDto.descriptions,
    };
  }

  protected override validate(data: IEditedMovieInfo): string[] {
    const errors: string[] = [];
    if (!data.imdb_id) {
      errors.push('imdb_id пусто');
    }
    for (const description of data.descriptions) {
      if (!description.title) {
        errors.push(`Отсутствует название для языка: ${description.lang}`);
      }
    }
    return errors;
  }

  protected async getDataRequestPromise(id?: IEditedMovieInfo['id']): Promise<IEditedMovieInfo> {
    if (id) {
      const data = await TypesafeMovies.getMovieInfo(id);
      if (data.data) {
        const levelInfoDto = data.data;
        return MovieEditWidgetModel.movieDtoToMovieInfo(levelInfoDto);
      }
    }
    return emptyMovie;
  }

  protected async getDataSaveRequestPromise(movieInfo: IEditedMovieInfo): Promise<IEditedMovieInfo> {
    const response = await MoviesApi.createMovieInfo({
      id: movieInfo.id?.toString(),
      tv_series: movieInfo.tv_series,
      original_title: movieInfo.original_title,
      descriptions: movieInfo.descriptions.reduce<IMovieInfoDto['descriptions']>((acc, {lang, title, ...descr}) => {
        if (title) {
          acc[lang] = {...descr, title};
        }
        return acc;
      }, {}),
      genres: movieInfo.genres,
      images: movieInfo.images.map(img => ({
        ...img,
        id: img.id?.toString(),
        name: img.src,
        content: img.content,
      })),
      release_date_ts: movieInfo.release_date && movieInfo.release_date?.getTime() / 1000,
      end_date_ts: movieInfo.end_date && movieInfo.end_date?.getTime() / 1000,
      countries: movieInfo.countries,
      tmdb_id: +String(movieInfo.tmdb_id) || undefined,
      imdb_id: movieInfo.imdb_id,
    });

    if (response.data) {
      // TODO implement saving in v2 and use response.data instead of new request
      return this.getDataRequestPromise(Number(response.data.id));
    } else {
      throw new Error('response.data is empty');
    }
  }
}
