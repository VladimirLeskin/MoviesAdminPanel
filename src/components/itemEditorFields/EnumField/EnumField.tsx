import React, {useCallback, useMemo} from 'react';
import {Autocomplete, TextField} from '@mui/material';

import {IEnumFieldInfo, IFieldRendererProps} from 'src/entries/FieldInfo';

import css from './EnumField.module.scss';

type TOption<T> = {value: T; label: string};

const classes = {input: css.inputRoot};

export const EnumField = <T,>(props: IFieldRendererProps<T, IEnumFieldInfo<T>>) => {
  const {fieldInfo, isControlled, onChange} = props;

  const handleChange = useCallback(
    (_: unknown, newValue: TOption<T> | null) => {
      const preparedValue = newValue?.value ?? null;
      if (preparedValue !== null || fieldInfo.isClearable) {
        onChange(preparedValue as T);
      }
    },
    [fieldInfo.isClearable, onChange]
  );

  const value = useMemo(
    () => fieldInfo.options.find(opt => opt.value === props.value),
    [fieldInfo.options, props.value]
  );
  const defaultValue = useMemo(
    () => fieldInfo.options.find(opt => opt.value === props.defaultValue),
    [fieldInfo.options, props.defaultValue]
  );

  return (
    <Autocomplete
      key={defaultValue?.label}
      size="small"
      className={css.root}
      classes={classes}
      onChange={handleChange}
      disableClearable={!fieldInfo.isClearable}
      value={value ?? (isControlled ? null : undefined)}
      defaultValue={defaultValue}
      options={fieldInfo.options}
      disabled={fieldInfo.disabled}
      renderInput={params => (
        <TextField
          {...params}
          required={fieldInfo.required}
          label={fieldInfo.title}
          placeholder={fieldInfo.placeholder}
        />
      )}
    />
  );
};
