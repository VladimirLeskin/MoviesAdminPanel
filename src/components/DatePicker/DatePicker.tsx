import React, {FC, useCallback, useEffect, useState} from 'react';
import {DatePicker as MuiDatePicker, ruRU, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePickerProps} from '@mui/x-date-pickers/DatePicker/DatePicker.types';
import {ru} from 'date-fns/locale';
import {TextFieldProps} from '@mui/material/TextField/TextField';

interface Props extends Omit<DatePickerProps<Date>, 'onChange' | 'value' | 'renderInput'> {
  value?: Date | null;
  defaultValue?: Date | null;
  extraInputParams?: TextFieldProps;
  toolbarPlaceholder?: string;

  onChange: (date: Date | null) => void;
}

export const DatePicker: FC<Props> = ({
  value,
  defaultValue,
  onChange,
  extraInputParams,
  toolbarPlaceholder,
  ...otherProps
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<null | Date>(value || defaultValue || null);
  const onDatePicked = useCallback(
    (date: Date | null) => {
      setSelectedDate(date);
      onChange(date);
    },
    [onChange]
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
    }
  }, [value]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ru}
      localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <MuiDatePicker
        format="dd.MM.yyyy"
        onChange={onDatePicked}
        value={selectedDate}
        slotProps={{
          textField: {variant: 'outlined', ...extraInputParams},
          toolbar: {toolbarPlaceholder: toolbarPlaceholder},
        }}
        {...otherProps}
      />
    </LocalizationProvider>
  );
};
