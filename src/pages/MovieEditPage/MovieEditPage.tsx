import React, {FC, useCallback, useEffect} from 'react';
import {useParams} from 'react-router';
import {MovieEditPageModel} from './movie-edit-page.model';
import {observer} from 'mobx-react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Button, FormControl, TextField} from '@mui/material';

import {DescriptionForm} from './components/DescriptionForm';
import {IEditedMovieInfo} from './types';
import {ArrayInput} from 'src/components/ArrayInput/ArrayInput';
import {ImageEditor} from './components/ImageEditor';

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

export const MovieEditPage: FC<MovieEditPageProps> = observer(props => {
  const {movieId} = useParams<{movieId: string}>();
  const {movieInfo, updateMovie, load, save} = movieEditPageModel;

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
      updateMovie({...movieInfo, release_date: new Date(e.target.value)});
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
      <div className={css.Buttons}>
        <Button onClick={save}>Сохранить</Button>
      </div>
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
          <input
            type="date"
            value={movieInfo.release_date?.toISOString().substring(0, 10) ?? ''}
            onChange={onReleaseDateChanged}
          />
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
