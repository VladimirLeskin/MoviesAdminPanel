import React, {FC, useCallback, useMemo} from 'react';

import {DatePicker} from 'src/components/DatePicker/DatePicker';
import {IFieldRendererProps} from 'src/entries/FieldInfo';

export const DateField: FC<IFieldRendererProps<Date | undefined>> = ({
  onChange,
  value,
  isControlled,
  defaultValue,
  fieldInfo,
}) => {
  const {title, disabled, placeholder} = fieldInfo;

  const onDatePicked = useCallback(
    (date: Date | null) => {
      onChange(date ?? undefined);
    },
    [onChange]
  );

  const inputProps = useMemo(() => ({required: fieldInfo.required, size: 'small' as const}), [fieldInfo.required]);

  return (
    <DatePicker
      value={value ?? (isControlled ? null : undefined)}
      defaultValue={defaultValue}
      onChange={onDatePicked}
      disabled={disabled}
      toolbarPlaceholder={placeholder}
      label={title}
      extraInputParams={inputProps}
    />
  );
};
