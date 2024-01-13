import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Autocomplete, Box, FormControl, FormLabel, TextField} from '@mui/material';

import {IFieldInfo, IFieldRendererProps, IStructFieldInfo} from 'src/entries/FieldInfo';
import {ItemEditor} from '../../ItemEditor/ItemEditor';
import {TItemSchema} from 'src/entries/BaseEntity';
import {TSelectOption} from 'src/type';

export const StructOneOfField = <T extends Record<string, unknown>>({
  value,
  defaultValue,
  isControlled,
  onChange,
  fieldInfo,
}: IFieldRendererProps<Partial<T>, IStructFieldInfo<Partial<T>>>) => {
  const {disabled, title} = fieldInfo;
  const [stateValue, setStateValue] = useState<Partial<T>>(value ?? (isControlled ? {} : defaultValue) ?? {});

  const FIELD_OPTIONS: TSelectOption<keyof T>[] = useMemo(
    () =>
      Object.entries(fieldInfo.subFields).map(([key, field]: [keyof T, IFieldInfo<any>]) => ({
        value: key,
        label: field.title ?? key.toString(),
      })),
    [fieldInfo.subFields]
  );

  if (!FIELD_OPTIONS.length) {
    throw new Error(`Пустой набор полей для StructOneOfField, проверьте конфигурацию поля ${title}`);
  }

  const [selectedField, setSelectedField] = useState<keyof T>(
    () => getInitialSelectedField(value, defaultValue, isControlled) ?? Object.keys(fieldInfo.subFields)[0]
  );
  const savedValues = useRef<Partial<T>>(value ?? (isControlled ? {} : defaultValue) ?? {});

  const selectedOption = FIELD_OPTIONS.find(opt => opt.value === selectedField) ?? null;

  const onSelectedFieldChanged = useCallback(
    (_, opt: TSelectOption<keyof T>) => {
      setSelectedField(opt.value);
      const cureValue = {[opt.value]: savedValues.current[opt.value]} as Partial<T>;
      setStateValue(cureValue);
      onChange(cureValue);
    },
    [onChange]
  );

  const onFieldChanged = useCallback(
    (values: Partial<T>) => {
      const curFieldValue = {[selectedField]: values[selectedField]} as Partial<T>;
      setStateValue(curFieldValue);
      onChange(curFieldValue);
      savedValues.current[selectedField] = values[selectedField];
    },
    [onChange, selectedField]
  );

  const subFields = useMemo(
    () =>
      ({
        [selectedField]: {
          ...fieldInfo.subFields[selectedField],
          title: undefined,
        } as IFieldInfo<T[typeof selectedField]>,
      }) as TItemSchema<Partial<T>>,
    [fieldInfo.subFields, selectedField]
  );

  return (
    <FormControl>
      <FormLabel>{title}</FormLabel>
      <Box display="flex" alignItems="center">
        <Autocomplete<TSelectOption<keyof T>, false, false>
          options={FIELD_OPTIONS}
          value={selectedOption}
          onChange={onSelectedFieldChanged}
          disabled={disabled}
          renderInput={params => <TextField {...params} />}
        />
        {selectedField && (
          <ItemEditor<Partial<T>> fields={subFields} onChange={onFieldChanged} value={stateValue} isControlled />
        )}
      </Box>
    </FormControl>
  );
};

function getInitialSelectedField<T extends Record<string, unknown>>(
  value: T | undefined,
  defaultValue: T | undefined,
  isControlled?: boolean
): keyof T | undefined {
  let obj = defaultValue;
  if (value || isControlled) {
    obj = value;
  }

  if (obj) {
    const keys = Object.keys(obj);
    return keys.find(k => obj?.[k] !== undefined) ?? keys[0];
  }
  return undefined;
}
