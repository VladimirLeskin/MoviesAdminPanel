import React, {FC, useCallback, useEffect, useState} from 'react';
import {TextField} from '@mui/material';

import {IFieldRendererProps} from 'src/entries/FieldInfo';

const numericRegexp = /[+-]?(\d+[,.]?\d*)?/;

export const NumericField: FC<IFieldRendererProps<number | undefined>> = props => {
  const {fieldInfo, onChange, defaultValue, value, error} = props;
  const [stateValue, setStateValue] = useState((value ?? defaultValue)?.toString());

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const stringValue = e.target.value;
      if (stringValue === '') {
        onChange(undefined);
        setStateValue('');
      } else {
        const matches = stringValue.match(numericRegexp);
        const validStringValue = matches?.[0];
        if (validStringValue) {
          const numericValue = +(
            validStringValue.match(/[,.]$/) ? `${validStringValue}0` : validStringValue
          ).replaceAll(',', '.');
          setStateValue(validStringValue);
          if (!Number.isNaN(numericValue)) {
            onChange(numericValue);
          }
        }
      }
    },
    [onChange]
  );

  useEffect(() => {
    setStateValue((value ?? defaultValue)?.toString());
  }, [defaultValue, value]);

  return (
    <TextField
      error={!!error?.error}
      helperText={error?.error}
      required={fieldInfo.required}
      label={fieldInfo.title}
      disabled={fieldInfo.disabled}
      onChange={handleTextChange}
      value={stateValue ?? ''}
      placeholder={fieldInfo.placeholder}
      size="small"
    />
  );
};
