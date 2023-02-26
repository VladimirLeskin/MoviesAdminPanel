import React, {FC, useCallback, useEffect} from 'react';
import {SelectChangeEvent} from '@mui/material/Select/SelectInput';
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
import {Save} from '@mui/icons-material';
import {observer} from 'mobx-react';

import {ArrayInput} from 'src/components/ArrayInput/ArrayInput';
import {MovieEditWidgetModel} from 'src/widgets/MovieEditWidget/movie-edit-widget.model';
import {ImageEditor} from 'src/widgets/MovieEditWidget/components/ImageEditor';
import {DescriptionForm} from 'src/widgets/MovieEditWidget/components/DescriptionForm';
import {IEditedMovieInfo} from 'src/widgets/MovieEditWidget/types';
import {COUNTRIES} from '../../models/CountriesModel';

import css from './MovieEditWidget.module.scss';

const movieEditPageModel = new MovieEditWidgetModel();

interface Props {
  movieId?: string;
  onSaved?: (id: string) => void;
}

const stringFields = [
  {key: 'id', title: 'Id'},
  {key: 'original_title', title: 'Оригинальное название'},
  {key: 'imdb_id', title: 'imdb_id'},
  {key: 'tmdb_id', title: 'tmdb_id'},
];

export const MovieEditWidget: FC<Props> = observer(({movieId, onSaved}) => {
  const {movieInfo, updateMovie, genresDescription, isLoading, load, save} = movieEditPageModel;

  const onSave = useCallback(() => {
    save().then(() => {
      if (movieEditPageModel.movieInfo.id) {
        onSaved?.(movieEditPageModel.movieInfo.id);
      }
    });
  }, [onSaved, save]);

  useEffect(() => {
    load(movieId);
  }, [load, movieId]);

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

  const onCountriesChanged = useCallback(
    (e: SelectChangeEvent<string[]>) => {
      const value = e.target.value;
      updateMovie({...movieInfo, countries: typeof value === 'string' ? value.split(',') : value});
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
            <InputLabel>Страны</InputLabel>
            <Select
              variant="outlined"
              label="Страны"
              value={movieInfo.countries}
              onChange={onCountriesChanged}
              multiple
              multiline
              renderValue={selected =>
                Object.values(COUNTRIES.countries)
                  .filter(c => selected.includes(c.country_code))
                  .map(c => c.name || c.country_code)
                  .join(', ')
              }
            >
              {Object.values(COUNTRIES.countries).map(country => (
                <MenuItem key={country.country_code} value={country.country_code}>
                  <Checkbox checked={movieInfo.countries.includes(country.country_code)} size="small" />
                  <ListItemText primary={country.name || country.country_code} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                  <Checkbox checked={movieInfo.genres.includes(genre.genre_id)} size="small" />
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
        <Fab onClick={onSave} variant="extended" color="primary" disabled={isLoading}>
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
