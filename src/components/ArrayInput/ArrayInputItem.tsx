import React, {useCallback} from 'react';
import {IconButton} from '@mui/material';
import {Close} from '@mui/icons-material';

import {InputProps} from './types';

import css from './ArrayInput.module.scss';

interface ArrayInputItemProps<ValueType, MetaType> {
  inputRender: React.ComponentType<InputProps<ValueType, MetaType>>;
  value: ValueType;
  index: number;
  onChange: (value: ValueType, index: number) => void;
  onDelete: (index: number) => void;
  metaData?: MetaType;
  disabled?: boolean;
}

export const ArrayInputItem = <ValueType extends unknown, MetaType extends unknown = void>({
  inputRender,
  value,
  index,
  metaData,
  onChange,
  onDelete,
  disabled,
}: ArrayInputItemProps<ValueType, MetaType>) => {
  const onChangeItem = useCallback(
    (changedValue: ValueType) => {
      onChange(changedValue, index);
    },
    [index, onChange]
  );

  const onDeleteItem = useCallback(() => {
    onDelete(index);
  }, [index, onDelete]);

  const InputComponent = inputRender;
  return (
    <div className={css.ArrayInputItem}>
      <div className={css.ArrayInputItemRenderer}>
        <InputComponent value={value} onChange={onChangeItem} disabled={disabled} metaData={metaData} />
      </div>
      {!disabled && (
        <IconButton onClick={onDeleteItem}>
          <Close />
        </IconButton>
      )}
    </div>
  );
};
