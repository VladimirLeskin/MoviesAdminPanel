import React, {FC, useCallback, useState} from 'react';
import {Button, Modal} from '@mui/material';
import {ArrowBackIos, ArrowForwardIos} from '@mui/icons-material';

import {Image} from 'src/components/Image';
import {IMovieListItem} from 'src/api/dto/MovieDto';

import css from './ImagesCellRenderer.module.scss';

interface Props {
  movie: IMovieListItem;
  onSelectImage?: (movie: IMovieListItem, image: {id: string; path: string}) => void;
}

export const ImagesCellRenderer: FC<Props> = ({movie, onSelectImage}) => {
  const [previewImg, setPreviewImg] = useState<{id: string; path: string} | undefined>();

  const onSelectImageHandler = useCallback(() => {
    if (previewImg) {
      onSelectImage?.(movie, previewImg);
    }
  }, [movie, onSelectImage, previewImg]);

  const navigateImage = useCallback(
    (e: {key: string}) => {
      const curIndex = movie.images.indexOf(previewImg!);
      const lastIndex = movie.images.length - 1;
      const firstIndex = 0;
      let newIndex = curIndex;

      if (e.key === 'ArrowLeft') {
        newIndex = curIndex - 1;
      } else if (e.key === 'ArrowRight') {
        newIndex = curIndex + 1;
      }

      if (newIndex < firstIndex) {
        newIndex = lastIndex;
      } else if (newIndex > lastIndex) {
        newIndex = firstIndex;
      }

      setPreviewImg(movie.images[newIndex]);
    },
    [movie.images, previewImg]
  );

  return (
    <div className={css.MoviesImagesThumbnails}>
      {movie.images.map(img => (
        <Image key={img.id} src={img.path} width={75} onClick={() => setPreviewImg(img)} />
      ))}
      <Modal
        open={!!previewImg}
        onClose={() => setPreviewImg(undefined)}
        className={css.PreviewModal}
        onKeyDown={navigateImage}
      >
        <div className={css.PreviewModalContent}>
          <div>
            <Image src={previewImg?.path} style={{maxWidth: 700, maxHeight: 500}} />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={`${css.NavButton} ${css.NavButtonBack}`}
              onClick={() => navigateImage({key: 'ArrowLeft'})}
            >
              <ArrowBackIos fontSize="small" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={`${css.NavButton} ${css.NavButtonForward}`}
              onClick={() => navigateImage({key: 'ArrowRight'})}
            >
              <ArrowForwardIos fontSize="small" />
            </Button>
          </div>
          <div className={css.MoviesImagesThumbnails}>
            {movie.images.map(img => (
              <Image
                src={img.path}
                width={75}
                key={img.id}
                onClick={() => setPreviewImg(img)}
                className={img.id === previewImg?.id ? css.Selected : undefined}
              />
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
