import React, {FC, useCallback} from 'react';
import {FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {SelectChangeEvent} from '@mui/material/Select/SelectInput';

import css from '../../../widgets/LevelEditWidget/LevelEditWidget.module.scss';

interface IDescriptionInfo {
  lang?: string;
  description?: string;
  title?: string;
  tagline?: string;
}

interface DescriptionFormProps {
  info: IDescriptionInfo;
  onChange: (v: IDescriptionInfo) => void;
}

const stringFields = [
  {key: 'title', title: 'Название'},
  {key: 'description', title: 'Описание'},
  {key: 'tagline', title: 'Слоган'},
];

export const DescriptionForm: FC<DescriptionFormProps> = ({info, onChange}) => {
  const updateField = useCallback(
    (id: string, value: any) => {
      onChange({...info, [id]: value});
    },
    [info, onChange]
  );

  const onLangChanged = useCallback(
    (e: SelectChangeEvent) => {
      onChange({...info, lang: e.target.value});
    },
    [info, onChange]
  );

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Язык</InputLabel>
        <Select value={info.lang} label="Язык" onChange={onLangChanged}>
          <MenuItem value="ru">ru</MenuItem>
          <MenuItem value="en">en</MenuItem>
        </Select>
        {stringFields.map(({key, title}) => (
          <FormControl key={key} className={css.Control} size="small" margin="dense">
            <TextField
              label={title}
              variant="outlined"
              value={info[key] ?? ''}
              size="small"
              multiline={key === 'description'}
              onChange={e => updateField(key, e.target.value)}
            />
          </FormControl>
        ))}
      </FormControl>
    </div>
  );
};
