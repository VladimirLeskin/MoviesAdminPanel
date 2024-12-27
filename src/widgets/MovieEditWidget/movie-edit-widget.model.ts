import {makeObservable} from 'mobx';
import {IEditedMovieInfo} from './types';
import {EntityEditorModel} from '../../models/EntityEditorModel';
import {MoviesApi} from '../../api/MoviesApi';
import {MovieDetails, MovieSaveInfo} from '../../api/Api';

const emptyMovie: IEditedMovieInfo = {
  tv_series: false,
  status: 'MODERATION',
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
      status: movieInfoDto.status,
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
      const data = await MoviesApi.getMovieInfo(id);
      if (data.data) {
        const levelInfoDto = data.data;
        return MovieEditWidgetModel.movieDtoToMovieInfo(levelInfoDto);
      }
    }
    return emptyMovie;
  }

  protected async getDataSaveRequestPromise(movieInfo: IEditedMovieInfo): Promise<IEditedMovieInfo> {
    const dto: MovieSaveInfo = {
      tv_series: movieInfo.tv_series,
      status: movieInfo.status,
      original_title: movieInfo.original_title,
      descriptions: movieInfo.descriptions
        .map(({title, ...descr}) => (title !== undefined ? {title, ...descr} : null))
        .filter(it => it != null),
      genres: movieInfo.genres,
      images: movieInfo.images
        .map(({id, src, ...img}) =>
          id !== undefined && src !== undefined
            ? {
                ...img,
                id,
                name: src,
                content: img.content,
              }
            : null
        )
        .filter(it => it != null),
      new_images: movieInfo.images.filter(img => !img.id),
      release_date_ts: movieInfo.release_date && movieInfo.release_date?.getTime(),
      end_date_ts: movieInfo.end_date && movieInfo.end_date?.getTime(),
      countries: movieInfo.countries,
      tmdb_id: +String(movieInfo.tmdb_id) || undefined,
      imdb_id: movieInfo.imdb_id,
    };

    const response = await (movieInfo.id
      ? MoviesApi.updateMovieInfo(movieInfo.id, dto)
      : MoviesApi.createMovieInfo(dto));

    if (response.data) {
      return MovieEditWidgetModel.movieDtoToMovieInfo(response.data);
    } else {
      throw new Error('response.data is empty');
    }
  }
}
