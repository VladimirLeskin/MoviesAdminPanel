import React, {FC, useCallback} from 'react';
import {Box, FormControl, FormLabel} from '@mui/material';

import {IFieldRendererProps} from 'src/entries/FieldInfo';
import {Attach} from '../../Attach/Attach';

import css from './FileField.module.scss';

export const FileField: FC<IFieldRendererProps<File | undefined>> = ({onChange, fieldInfo}) => {
  const onFileChanged = useCallback(
    (file: File | undefined) => {
      onChange(file);
    },
    [onChange]
  );

  return (
    <FormControl className={css.root} required={fieldInfo.required}>
      <FormLabel>{fieldInfo.title}</FormLabel>
      <Box display="flex" alignItems="center" className={css.Control}>
        <Attach onFileChanged={onFileChanged} />
      </Box>
    </FormControl>
  );
};
