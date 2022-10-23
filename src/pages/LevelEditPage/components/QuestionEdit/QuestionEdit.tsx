import React, {FC, useCallback} from 'react';
import {Drawer, IconButton} from '@mui/material';
import {Remove} from '@mui/icons-material';

import {IEditedLevelQuestionVariant} from '../../types';
import {useBooleanState} from 'src/hooks/useBooleanState';
import {MoviePicker} from 'src/widgets/MoviesPicker/MoviePicker';
import {IMovieDto} from 'src/api/dto/MovieDto';
import {Image} from 'src/components/Image/Image';

import css from './QuestionEdit.module.scss';

interface Image {
  id: string;
  path: string;
}

interface QuestionEditProps {
  id?: string;
  image: {id: string; path: string};
  correctVariant?: IEditedLevelQuestionVariant;
  variants: IEditedLevelQuestionVariant[];
}

interface QuestionEditCallProps {
  onChange: (q: QuestionEditProps) => void;
}

export const QuestionEdit: FC<QuestionEditProps & QuestionEditCallProps> = ({
  id,
  image,
  correctVariant,
  variants,
  onChange,
}) => {
  const {state: pickerOpened, toggleState: togglePicker} = useBooleanState(false);

  const onSelectImage = useCallback(
    (movie: IMovieDto, newImage: Image) => {
      onChange({id, image: newImage, variants, correctVariant: {movie_id: movie.movie_id, title: movie.title}});
    },
    [id, onChange, variants]
  );

  const onAddVariant = useCallback(
    (movie: IMovieDto) => {
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
      onChange({id, image, variants: variants.filter((_, i) => index !== i)});
    },
    [id, image, onChange, variants]
  );

  return (
    <div className={css.root}>
      <div onClick={togglePicker}>
        {image.path ? <Image src={image.path} className={css.image} /> : <span>Выберите кадр</span>}
      </div>
      <div>
        <div>
          <div>
            <span>
              <b>{correctVariant?.title}</b>
            </span>
          </div>
          {variants.map((v, index) => (
            <div key={v.movie_id}>
              <IconButton onClick={() => onRemoveVariant(index)}>
                <Remove />
              </IconButton>
              <span>{v.title}</span>
            </div>
          ))}
        </div>
        <span onClick={togglePicker}>Добавить вариант</span>
      </div>
      <Drawer
        open={pickerOpened}
        anchor="right"
        variant="persistent"
        ModalProps={{
          keepMounted: true,
        }}
        onClose={togglePicker}
      >
        <div className={css.moviePicker}>
          <MoviePicker onSelectImage={onSelectImage} onSelectMovie={onAddVariant} />
        </div>
      </Drawer>
    </div>
  );
};
