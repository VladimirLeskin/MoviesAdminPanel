import React, {FC, useCallback, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router';
import {MovieEditPageModel} from './movie-edit-page.model';
import {observer} from 'mobx-react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Fab,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import {SelectChangeEvent} from '@mui/material/Select/SelectInput';
import {Save} from '@mui/icons-material';

import {DescriptionForm} from './components/DescriptionForm';
import {IEditedMovieInfo} from './types';
import {ArrayInput} from 'src/components/ArrayInput/ArrayInput';
import {ImageEditor} from './components/ImageEditor';
import {ROUTES} from '../../constants';

import css from './MoviesEditPage.module.scss';

interface MovieEditPageProps {}

const movieEditPageModel = new MovieEditPageModel();

const stringFields = [
  {key: 'id', title: 'Id'},
  {key: 'original_title', title: 'Оригинальное название'},
  {key: 'imdb_id', title: 'imdb_id'},
  {key: 'tmdb_id', title: 'tmdb_id'},
  {key: 'country', title: 'Страна (2-4 символа)'},
];

export const MovieEditPage: FC<MovieEditPageProps> = observer(() => {
  const navigate = useNavigate();
  const {movieId} = useParams<{movieId: string}>();
  const {movieInfo, updateMovie, genresDescription, isLoading, load, save} = movieEditPageModel;

  useEffect(() => {
    load(movieId);
  }, [load, movieId]);

  useEffect(() => {
    if (movieInfo.id && movieId !== movieInfo.id) {
      navigate(ROUTES.MOVIES.DETAILS.replace(':movieId', movieInfo.id));
    }
  }, [movieId, movieInfo.id, navigate]);

  const updateField = useCallback(
    (id: string, value: any) => {
      updateMovie({...movieInfo, [id]: value});
    },
    [movieInfo, updateMovie]
  );

  const onChangeDescription = useCallback(
    (descr: IEditedMovieInfo['descriptions']) => {
      updateMovie({
        ...movieInfo,
        descriptions: descr,
      });
    },
    [movieInfo, updateMovie]
  );

  const onReleaseDateChanged = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        updateMovie({...movieInfo, release_date: new Date(e.target.value)});
      }
    },
    [movieInfo, updateMovie]
  );

  const onGenresChanged = useCallback(
    (e: SelectChangeEvent<number[]>) => {
      const value = e.target.value;
      updateMovie({...movieInfo, genres: typeof value === 'string' ? value.split(',').map(v => +v) : value});
    },
    [movieInfo, updateMovie]
  );

  const onImagesChanged = useCallback(
    (images: IEditedMovieInfo['images']) => {
      updateMovie({...movieInfo, images});
    },
    [movieInfo, updateMovie]
  );

  return (
    <div className={css.root}>
      <div className={css.MovieInfo}>
        <Box flexDirection="column" display="flex">
          {stringFields.map(({key, title}) => (
            <FormControl key={key} className={css.Control} size="small">
              <TextField
                label={title}
                disabled={key === 'id'}
                variant={key === 'id' ? 'filled' : 'outlined'}
                value={movieInfo[key] ?? ''}
                size="small"
                onChange={e => updateField(key, e.target.value)}
              />
            </FormControl>
          ))}
          <FormControl variant="outlined">
            <InputLabel>Жанры</InputLabel>
            <Select
              variant="outlined"
              label="Жанры"
              value={movieInfo.genres}
              onChange={onGenresChanged}
              multiple
              multiline
              renderValue={selected =>
                genresDescription
                  .filter(g => selected.includes(g.genre_id))
                  .map(g => g.name)
                  .join(', ')
              }
            >
              {genresDescription.map(genre => (
                <MenuItem key={genre.genre_id} value={genre.genre_id}>
                  <Checkbox checked={movieInfo.genres.includes(genre.genre_id)} />
                  <ListItemText primary={genre.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <p>
            <input
              type="date"
              value={movieInfo.release_date?.toISOString().substring(0, 10) ?? ''}
              onChange={onReleaseDateChanged}
            />
          </p>
        </Box>
        <ArrayInput
          onChange={onChangeDescription}
          defaultValue={{lang: 'ru'}}
          value={movieInfo.descriptions}
          inputRender={DescrInput}
        />
      </div>
      <div className={css.Images}>
        <ArrayInput inputRender={ImagesInput} defaultValue={{}} value={movieInfo.images} onChange={onImagesChanged} />
      </div>
      <div className={css.Buttons}>
        <Fab onClick={save} variant="extended" color="primary" disabled={isLoading}>
          <Save /> Сохранить
        </Fab>
      </div>
    </div>
  );
});

function ImagesInput({onChange, value}: {value: IEditedMovieInfo['images'][0]; onChange: any}) {
  return <ImageEditor imgInfo={value} onChange={onChange} />;
}

function DescrInput({onChange, value}: {value: IEditedMovieInfo['descriptions'][0]; onChange: any}) {
  return (
    <Accordion className={css.Description}>
      <AccordionSummary>{[value.lang, value.title].join(': ')}</AccordionSummary>
      <AccordionDetails>
        <Box flexDirection="column" display="flex">
          <DescriptionForm info={value} onChange={onChange} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
