import React, {FC, useCallback} from 'react';
import {TextField} from '@mui/material';

import {IFieldRendererProps} from 'src/entries/FieldInfo';

export const StringField: FC<IFieldRendererProps<string>> = props => {
  const {fieldInfo, onChange, defaultValue, value, isControlled, error} = props;
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <TextField
      required={fieldInfo.required}
      label={fieldInfo.title}
      error={!!error?.error}
      helperText={error?.error}
      disabled={fieldInfo.disabled}
      onChange={handleTextChange}
      value={value ?? (isControlled ? '' : undefined)}
      defaultValue={defaultValue}
      placeholder={fieldInfo.placeholder}
      size="small"
    />
  );
};

export const TextAreaField: FC<IFieldRendererProps<string>> = props => {
  const {fieldInfo, onChange, defaultValue, value, isControlled, error} = props;
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <TextField
      required={fieldInfo.required}
      label={fieldInfo.title}
      error={!!error?.error}
      helperText={error?.error}
      disabled={fieldInfo.disabled}
      onChange={handleTextChange}
      value={value ?? (isControlled ? '' : undefined)}
      defaultValue={defaultValue}
      multiline
      placeholder={fieldInfo.placeholder}
    />
  );
};
