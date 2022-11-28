import React, {PropsWithChildren, useCallback} from 'react';
import {Button} from '@mui/material';

import {InputProps} from './types';
import {ArrayInputItem} from './ArrayInputItem';

export interface ArrayInputProps<ValueType, MetaType = void> {
  inputRender: React.ComponentType<InputProps<ValueType, MetaType>>;
  defaultValue: ValueType;
  value: ValueType[];
  metaData?: MetaType;

  disabled?: boolean;

  onChange: (value: ValueType[]) => void;
  onAddInput?: () => void;
}

export const ArrayInput = <ValueType extends unknown, MetaType extends unknown = void>({
  inputRender,
  defaultValue,
  value,
  metaData,
  onChange,
  onAddInput,
  disabled,
}: PropsWithChildren<ArrayInputProps<ValueType, MetaType>>) => {
  const addHandler = useCallback(() => {
    if (onAddInput) {
      onAddInput();
    } else {
      onChange([...value, defaultValue]);
    }
  }, [onChange, value, defaultValue, onAddInput]);

  const onDelete = useCallback(
    (index: number) => {
      const copiedInputs = [...value];
      copiedInputs.splice(index, 1);

      onChange(copiedInputs);
    },
    [onChange, value]
  );

  const onChangeItem = useCallback(
    (newValue: ValueType, itemIndex: number) => {
      const copiedInputs = [...value];
      copiedInputs[itemIndex] = newValue;

      onChange(copiedInputs);
    },
    [value, onChange]
  );

  return (
    <>
      <div className="InputsContainer">
        {value.map((inputValue, index) => {
          return (
            <ArrayInputItem<ValueType, MetaType>
              key={index}
              value={inputValue}
              index={index}
              onChange={onChangeItem}
              onDelete={onDelete}
              inputRender={inputRender}
              disabled={disabled}
              metaData={metaData}
            />
          );
        })}
      </div>
      {!disabled && <Button onClick={addHandler}>Добавить</Button>}
    </>
  );
};
