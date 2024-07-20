import {IEditedMovieInfo} from './types';

export function getMovieTitle(movie?: IEditedMovieInfo) {
  const title = (movie?.descriptions?.find(({lang}) => lang === 'ru') ?? movie?.descriptions[0])?.title ?? movie?.id;

  if (title) {
    return ['Редактировать', `"${title}"`, movie?.release_date?.getFullYear()].filter(Boolean).join(' ');
  }
  return 'Добавить фильм';
}
