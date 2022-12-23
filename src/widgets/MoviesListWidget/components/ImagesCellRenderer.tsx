import React, {FC, useCallback, useState} from 'react';
import {Button, Modal} from '@mui/material';

import {Image} from 'src/components/Image/Image';
import {IMovieDto} from 'src/api/dto/MovieDto';

import css from './ImagesCellRenderer.module.scss';

interface Props {
  movie: IMovieDto;
  onSelectImage?: (movie: IMovieDto, image: {id: string; path: string}) => void;
}

export const ImagesCellRenderer: FC<Props> = ({movie, onSelectImage}) => {
  const [previewImg, setPreviewImg] = useState<{id: string; path: string} | undefined>();

  const onSelectImageHandler = useCallback(() => {
    if (previewImg) {
      onSelectImage?.(movie, previewImg);
    }
  }, [movie, onSelectImage, previewImg]);

  return (
    <div className={css.MoviesImagesThumbnails}>
      {movie.images.map(img => (
        <Image src={img.path} width={75} key={img.id} onClick={() => setPreviewImg(img)} />
      ))}
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
          {onSelectImage && (
            <Button variant="contained" onClick={onSelectImageHandler}>
              Выбрать эту картинку
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};
