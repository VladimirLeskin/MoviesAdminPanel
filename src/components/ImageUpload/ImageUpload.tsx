import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {Button} from '@mui/material';

import css from './ImageUpload.module.scss';

interface ImageUploadProps {
  src?: string;
  onChange: (content: string) => void;
}

export const ImageUpload: FC<ImageUploadProps> = props => {
  const {src, onChange} = props;
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const content = reader.result;
          if (typeof content === 'string') {
            setImgSrc(content);
            onChange(content);
          } else {
            // TODO
            console.error('unexpected image content');
            return;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className={css.root}>
      <label>
        <input accept="image/*" multiple type="file" style={{display: 'none'}} onChange={onFileChange} />
        <Button variant="contained" component="span">
          Загрузить
        </Button>
      </label>
      {!!imgSrc && (
        <div className={css.imagePreview}>
          <img className={css.img} src={imgSrc} />
        </div>
      )}
    </div>
  );
};
