import {makeObservable} from 'mobx';
import {IEditedMovieInfo} from './types';
import MoviesApi from '../../api/Movies';
import {IMovieInfoDto} from '../../api/dto/MovieDto';
import Config from '../../entries/Config';
import {EntityEditorModel} from '../../models/EntityEditorModel';

const emptyMovie: IEditedMovieInfo = {
  adult: false,
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

  private static movieDtoToMovieInfo(movieInfoDto: IMovieInfoDto): IEditedMovieInfo {
    return {
      id: movieInfoDto.id,
      original_title: movieInfoDto.original_title,
      imdb_id: movieInfoDto.imdb_id,
      tmdb_id: movieInfoDto.tmdb_id?.toString(),
      countries: movieInfoDto.countries,
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

  protected validate(data: IEditedMovieInfo): string[] {
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
      countries: movieInfo.countries,
      tmdb_id: +String(movieInfo.tmdb_id) || undefined,
      imdb_id: movieInfo.imdb_id,
    });

    if (response.data) {
      return MovieEditWidgetModel.movieDtoToMovieInfo(response.data);
    } else {
      throw new Error('response.data is empty');
    }
  }
}
