import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {Button} from '@mui/material';

import {IFieldRendererProps} from 'src/entries/FieldInfo';
import css from '../../ImageUpload/ImageUpload.module.scss';

interface Data {
  id?: string;
  src?: string;
  content?: string;
}

export const ImageField: FC<IFieldRendererProps<Data>> = props => {
  const {value, defaultValue, onChange} = props;
  const [state, setState] = useState(value || defaultValue);

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const content = reader.result;
          if (typeof content === 'string') {
            setState({...state, content});
            onChange({...state, content});
          } else {
            // TODO
            console.error('unexpected image content');
            return;
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [state, onChange]
  );

  useEffect(() => {
    setState(value);
  }, [value]);

  const content = state?.content || state?.src;

  return (
    <div className={css.root}>
      <label>
        <input accept="image/*" type="file" style={{display: 'none'}} onChange={onFileChange} />
        <Button variant="contained" component="span">
          Загрузить
        </Button>
      </label>
      {!!content && (
        <div className={css.imagePreview}>
          <img className={css.img} src={content} />
        </div>
      )}
    </div>
  );
};
