import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {Button, CircularProgress, IconButton} from '@mui/material';
import {Cancel, Forward} from '@mui/icons-material';

import {Image} from '../../Image';
import {IFieldRendererProps} from 'src/entries/FieldInfo';
import css from './ImageUpload.module.scss';

interface Data {
  id?: string;
  src?: string;
  content?: string;
}

export const ImageField: FC<IFieldRendererProps<Data>> = props => {
  const [loading, setLoading] = useState(false);
  const {value, defaultValue, isControlled: _isControlled, onChange} = props;
  const [isControlled] = useState(_isControlled || !!value);
  const [state, setState] = useState(value || defaultValue);

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        setLoading(true);
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
          setLoading(false);
        };
        reader.readAsDataURL(file);
      }
    },
    [state, onChange]
  );

  const handleReset = useCallback(() => {
    setState({...state, content: undefined});
    onChange({...state, content: undefined});
  }, [onChange, state]);

  useEffect(() => {
    if (isControlled) {
      setState(value);
    }
  }, [isControlled, value]);

  const content = state?.content || state?.src;

  return (
    <div className={css.root}>
      <label>
        <input accept="image/*" type="file" style={{display: 'none'}} onChange={onFileChange} />
        <Button variant="contained" component="span" disabled={loading}>
          Загрузить
        </Button>
      </label>
      <div className={css.images}>
        {state?.src && (
          <div className={css.imagePreview}>
            {loading && (
              <div className={css.loader}>
                <CircularProgress size={24} variant="indeterminate" color="primary" className={css.circularProgress} />
              </div>
            )}
            <Image className={css.img} src={state.src} />
          </div>
        )}
        {state?.src && state.content && (
          <IconButton className={css.transferButton} onClick={handleReset}>
            <Forward className={css.arrow} />
            <Cancel className={css.reset} />
          </IconButton>
        )}
        {state?.content && (
          <div className={css.imagePreview}>
            <img className={css.img} src={content} />
          </div>
        )}
      </div>
    </div>
  );
};
