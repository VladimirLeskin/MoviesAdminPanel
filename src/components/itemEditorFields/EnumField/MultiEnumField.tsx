import React, {useCallback, useMemo} from 'react';
import {Autocomplete, TextField} from '@mui/material';
import cn from 'classnames';

import {IEnumMultiFieldInfo, IFieldRendererProps} from 'src/entries/FieldInfo';

import css from './EnumField.module.scss';

type TOption<T> = {value: T; label: string};

export const MultiEnumField = <T,>(props: IFieldRendererProps<T[], IEnumMultiFieldInfo<T>>) => {
  const {fieldInfo, onChange, isControlled} = props;

  const handleChange = useCallback(
    (_: unknown, newValue: TOption<T>[]) => {
      onChange(newValue?.map(v => v.value) ?? []);
    },
    [onChange]
  );

  const value = useMemo(
    () => (props.value !== undefined ? fieldInfo.options.filter(opt => props.value?.includes(opt.value)) : undefined),
    [fieldInfo.options, props.value]
  );
  const defaultValue = useMemo(
    () =>
      props.defaultValue !== undefined
        ? fieldInfo.options.filter(opt => props.defaultValue?.includes(opt.value))
        : undefined,
    [fieldInfo.options, props.defaultValue]
  );

  return (
    <Autocomplete<TOption<T>, true>
      key={defaultValue?.length}
      disableCloseOnSelect
      size="small"
      className={cn(css.root, css.MultiValue)}
      onChange={handleChange}
      value={value ?? (isControlled ? [] : undefined)}
      defaultValue={defaultValue}
      options={fieldInfo.options}
      disabled={fieldInfo.disabled}
      isOptionEqualToValue={isOptionEqualToValue}
      multiple
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

MultiEnumField.defaultProps = {
  defaultValue: [],
};

function isOptionEqualToValue<T>(option: TOption<T>, value: TOption<T>) {
  return option.value === value.value;
}
