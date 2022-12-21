import React, {FC, useCallback, useEffect, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import {SelectAll} from '@mui/icons-material';
import {Button, Modal} from '@mui/material';
import {observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import {IMovieDto} from 'src/api/dto/MovieDto';
import {Image} from 'src/components/Image/Image';
import {Pagination} from 'src/components/Pagination/Pagination';
import {Spinner} from 'src/components/Spinner/Spinner';
import {MoviesPickerFilter} from './MoviesPickerFilter';
import {MoviesPickerModel} from './movies-picker.model';
import {ROUTES} from '../../constants';

import css from './MoviesPicker.module.scss';

interface MoviePickerProps {
  onSelectImage: (movie: IMovieDto, image: {id: string; path: string}) => void;
  onSelectMovie: (movie: IMovieDto) => void;
}

const model = new MoviesPickerModel();
model.loadMovies();

export const MoviePicker: FC<MoviePickerProps> = observer(props => {
  const {onSelectImage, onSelectMovie} = props;

  const {movies, total, pagination, filter, moviesLoading, onFilterChanged, onPaginationChanged} = model;

  const paginationContainer = (
    <div className={css.PaginationContainer}>
      <Spinner className={!moviesLoading && css.LoaderHidden} />
      <Pagination {...pagination} itemsTotal={total} onChange={onPaginationChanged} />
    </div>
  );

  return (
    <div>
      <MoviesPickerFilter {...filter} onChange={onFilterChanged} />
      {paginationContainer}
      <div>
        {movies.map(mov => (
          <MovieRow movie={mov} key={mov.movie_id} onSelectImage={onSelectImage} onSelectMovie={onSelectMovie} />
        ))}
      </div>
      {paginationContainer}
    </div>
  );
});

interface IMovieRow {
  movie: IMovieDto;
  onSelectImage: (movie: IMovieDto, image: {id: string; path: string}) => void;
  onSelectMovie: (movie: IMovieDto) => void;
}

function MovieRow(props: IMovieRow) {
  const {movie, onSelectImage, onSelectMovie} = props;
  const [previewImg, setPreviewImg] = useState<{id: string; path: string} | undefined>();

  const onSelectImageHandler = useCallback(() => {
    if (previewImg) {
      onSelectImage(movie, previewImg);
    }
  }, [movie, onSelectImage, previewImg]);

  const onSelectMovieHandler = useCallback(() => {
    onSelectMovie(movie);
  }, [movie, onSelectMovie]);

  return (
    <div key={movie.movie_id} className={css.MoviesPickerRow}>
      <IconButton onClick={onSelectMovieHandler}>
        <SelectAll fontSize="small" />
      </IconButton>
      <div>
        <Link to={ROUTES.MOVIES.DETAILS.replace(':movieId', movie.movie_id)} target="_blank">
          {movie.movie_id}
        </Link>
      </div>
      <div>{movie.date}</div>
      <div>
        {movie.title}/{movie.original_title}
      </div>
      <div className={css.MoviesImagesThumbnails}>
        {movie.images.map(img => (
          <Image src={img.path} width={75} key={img.id} onClick={() => setPreviewImg(img)} />
        ))}
      </div>
      <Modal open={!!previewImg} onClose={() => setPreviewImg(undefined)} className={css.PreviewModal}>
        <div className={css.PreviewModalContent}>
          <div>
            <Image src={previewImg?.path} style={{maxWidth: 700, maxHeight: 500}} />
          </div>
          <div className={css.MoviesImagesThumbnails}>
            {movie.images.map(img => (
              <Image src={img.path} width={75} key={img.id} onClick={() => setPreviewImg(img)} />
            ))}
          </div>
          <Button variant="contained" onClick={onSelectImageHandler}>
            Выбрать эту картинку
          </Button>
        </div>
      </Modal>
    </div>
  );
}
