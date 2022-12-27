import React, {useCallback} from 'react';
import {FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {SelectChangeEvent} from '@mui/material/Select/SelectInput';

import css from './MultiLangForm.module.scss';

interface IBaseObj {
  lang: string;
}

interface IStringField {
  key: string;
  title: string;
}

interface DescriptionFormProps<T extends IBaseObj> {
  stringFields: IStringField[];
  info: T;
  onChange: (v: T) => void;
}

export const DescriptionForm = <T extends IBaseObj>({stringFields, info, onChange}: DescriptionFormProps<T>) => {
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
        <InputLabel>Язык</InputLabel>
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
