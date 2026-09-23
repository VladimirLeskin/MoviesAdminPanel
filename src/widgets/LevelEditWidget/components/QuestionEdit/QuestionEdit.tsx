import React, {FC, useCallback} from 'react';
import {Button, Drawer, IconButton, Table, TableBody, TableCell, TableRow} from '@mui/material';
import {Delete} from '@mui/icons-material';

import {IEditedLevelQuestionVariant} from '../../types';
import {useBooleanState} from 'src/hooks/useBooleanState';
import {MoviePicker} from 'src/widgets/MoviesPicker/MoviePicker';
import {IMovieListItem} from 'src/api/dto/MovieDto';
import {Image} from 'src/components/Image';
import {drawerPaperWidth} from 'src/styles/drawer';

import css from './QuestionEdit.module.scss';

interface Image {
  id: number;
  path: string;
}

interface QuestionEditValue {
  id?: string;
  image: {id: number; path: string};
  correctVariant?: IEditedLevelQuestionVariant;
  variants: IEditedLevelQuestionVariant[];
}

interface QuestionEditProps {
  value?: QuestionEditValue;
  onChange: (q: QuestionEditValue) => void;
}

const defaultQuestion: QuestionEditValue = {variants: [], image: {id: 0, path: ''}};

export const QuestionEdit: FC<QuestionEditProps> = ({value = defaultQuestion, onChange}) => {
  const {id, image, correctVariant, variants} = value;
  const {state: imagesPickerOpened, toggleState: toggleImagesPicker} = useBooleanState(false);
  const {state: moviesPickerOpened, toggleState: toggleMoviesPicker} = useBooleanState(false);

  const onSelectImage = useCallback(
    (movie: IMovieListItem, newImage: Image) => {
      onChange({id, image: newImage, variants, correctVariant: {movie_id: movie.movie_id, title: movie.title}});
    },
    [id, onChange, variants]
  );

  const onAddVariant = useCallback(
    (movie: IMovieListItem) => {
      if (movie.movie_id !== correctVariant?.movie_id) {
        onChange({
          id,
          image,
          correctVariant,
          variants: variants.concat({title: movie.title, movie_id: movie.movie_id}),
        });
      }
    },
    [correctVariant, id, image, onChange, variants]
  );

  const onRemoveVariant = useCallback(
    (index: number) => {
      onChange({id, image, correctVariant, variants: variants.filter((_, i) => index !== i)});
    },
    [correctVariant, id, image, onChange, variants]
  );

  return (
    <div className={css.root}>
      <div onClick={toggleImagesPicker}>
        {image.path ? <Image src={image.path} className={css.image} /> : <Button variant="text">Выбрать кадр</Button>}
      </div>
      <div>
        <div>
          <div>
            <b>{correctVariant?.title}</b>
          </div>
          <Table size="small">
            <TableBody>
              {variants.map((v, index) => (
                <TableRow key={v.movie_id}>
                  <TableCell>
                    <IconButton onClick={() => onRemoveVariant(index)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell>{v.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button variant="text" onClick={toggleMoviesPicker}>
          Добавить вариант
        </Button>
      </div>
      <Drawer
        open={imagesPickerOpened}
        anchor="right"
        variant="temporary"
        onClose={toggleImagesPicker}
        PaperProps={{sx: drawerPaperWidth(800)}}
      >
        <div className={css.moviePicker}>
          <MoviePicker onSelectImage={onSelectImage} />
        </div>
      </Drawer>
      <Drawer
        open={moviesPickerOpened}
        anchor="right"
        variant="temporary"
        onClose={toggleMoviesPicker}
        PaperProps={{sx: drawerPaperWidth(800)}}
      >
        <div className={css.moviePicker}>
          <MoviePicker onSelectMovie={onAddVariant} />
        </div>
      </Drawer>
    </div>
  );
};
