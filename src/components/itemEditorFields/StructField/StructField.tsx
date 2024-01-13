import React from 'react';
import {Box, InputLabel} from '@mui/material';

import {IFieldRendererProps, IStructFieldInfo} from 'src/entries/FieldInfo';
import {ItemEditor} from '../../ItemEditor/ItemEditor';

export const StructField = <T extends Record<string, any>>(props: IFieldRendererProps<T, IStructFieldInfo<T>>) => {
  const {fieldInfo, ...otherProps} = props;

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <InputLabel>{fieldInfo.title}</InputLabel>
      <ItemEditor fields={fieldInfo.subFields} {...otherProps} layout={fieldInfo.layout} />
    </Box>
  );
};
