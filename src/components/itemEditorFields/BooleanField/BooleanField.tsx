import React, {FC, useCallback} from 'react';
import {Checkbox, FormControl, FormLabel} from '@mui/material';

import {IFieldRendererProps} from 'src/entries/FieldInfo';

import css from './BooleanField.module.scss';

export const BooleanField: FC<IFieldRendererProps<boolean>> = props => {
  const {fieldInfo, value, defaultValue, onChange} = props;

  const handleCheckBoxChanged = useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onChange(checked);
    },
    [onChange]
  );

  return (
    <FormControl className={css.root} required={fieldInfo.required}>
      <Checkbox
        disabled={fieldInfo.disabled}
        onChange={handleCheckBoxChanged}
        checked={value}
        defaultChecked={defaultValue}
      />
      <FormLabel>{fieldInfo.title}</FormLabel>
    </FormControl>
  );
};
