import React, {FC, useCallback, useState} from 'react';
import {Link, TextField} from '@mui/material';
import {OpenInNew} from '@mui/icons-material';

import {IFieldRendererProps} from 'src/entries/FieldInfo';

import {getImdbTitleUrl} from './imdbUrl';

import css from './ImdbIdField.module.scss';

export const ImdbIdField: FC<IFieldRendererProps<string | undefined>> = props => {
  const {fieldInfo, onChange, defaultValue, value, isControlled, error} = props;
  const [draft, setDraft] = useState(value ?? defaultValue ?? '');
  const currentValue = isControlled ? (value ?? '') : draft;
  const imdbUrl = getImdbTitleUrl(currentValue);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraft(e.target.value);
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={css.root}>
      <TextField
        required={fieldInfo.required}
        label={fieldInfo.title}
        error={!!error?.error}
        helperText={error?.error}
        disabled={fieldInfo.disabled}
        onChange={!fieldInfo.disabled ? handleTextChange : undefined}
        value={isControlled ? (value ?? '') : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        placeholder={fieldInfo.placeholder}
        size="small"
      />
      {imdbUrl && (
        <Link className={css.link} href={imdbUrl} target="_blank" rel="noopener noreferrer">
          IMDb
          <OpenInNew fontSize="inherit" />
        </Link>
      )}
    </div>
  );
};
