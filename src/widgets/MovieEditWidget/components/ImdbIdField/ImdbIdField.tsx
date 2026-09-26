import React, {FC, useCallback, useState} from 'react';
import {Link} from '@mui/material';
import {OpenInNew} from '@mui/icons-material';

import {StringField} from 'src/components/itemEditorFields/StringField/StringField';
import {IFieldRendererProps} from 'src/entries/FieldInfo';

import {getImdbTitleUrl} from './imdbUrl';

import css from './ImdbIdField.module.scss';

export const ImdbIdField: FC<IFieldRendererProps<string | undefined>> = props => {
  const {onChange, defaultValue, value, isControlled} = props;
  const [draft, setDraft] = useState(value ?? defaultValue ?? '');
  const currentValue = isControlled ? (value ?? '') : draft;
  const imdbUrl = getImdbTitleUrl(currentValue);

  const handleChange = useCallback(
    (next: string | undefined) => {
      setDraft(next ?? '');
      onChange(next);
    },
    [onChange]
  );

  return (
    <div className={css.root}>
      <StringField {...props} onChange={handleChange} />
      {imdbUrl && (
        <Link className={css.link} href={imdbUrl} target="_blank" rel="noopener noreferrer">
          IMDb
          <OpenInNew fontSize="inherit" />
        </Link>
      )}
    </div>
  );
};
