import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Skeleton} from '@mui/material';

import {IFieldRendererProps, ILayoutSettings, IBaseFieldInfo, TDataErrors, TFieldError} from '../../entries/FieldInfo';
import {Section1VerticalLayout} from '../layouts/Section1VerticalLayout';
import {TItemSchema} from '../../entries/BaseEntity';
import {TObject} from '../../type';
import {ArrayUtils} from '../../utils/ArrayUtils';

import css from './ItemEditor.module.scss';

// Способ сказать, что обязательно либо defaultValue, либо value (на будущее)
// interface IValue<TData> extends Props<TData> {
//   value: TData;
// }
//
// interface IDefaultValue<TData> extends Props<TData> {
//   defaultValue: TData;
// }
//
// type BaseProps<TData> = IValue<TData> | IDefaultValue<TData> | (IValue<TData> & IDefaultValue<TData>);

interface Props<TData> {
  fields: TItemSchema<TData>;
  value?: TData;
  defaultValue?: TData;
  onChange: (value: TData) => void;
  layout?: ILayoutSettings<TData>;
  showSkeletons?: boolean;
  isControlled?: boolean;
  errors?: TDataErrors<TData>;
}

export const ItemEditor = <TData extends Record<string, any> = TObject>({
  value,
  defaultValue,
  fields,
  onChange,
  layout,
  showSkeletons,
  isControlled,
  errors,
}: Props<TData>) => {
  const editedItem = useRef({...(value || defaultValue)});
  const Layout = layout?.layoutType || Section1VerticalLayout;

  useEffect(() => {
    if (value || isControlled) {
      editedItem.current = {...value} as TData;
    }
  }, [isControlled, value]);

  const onFieldChanged = useCallback(
    (id: string, fieldValue: any) => {
      const newValue = {...editedItem.current, [id]: fieldValue} as TData;
      editedItem.current = newValue;
      onChange(newValue);
    },
    [onChange]
  );

  const sections = useMemo(() => {
    const layoutSections = layout?.fieldsBySections || [Object.keys(fields)];
    return layoutSections.map(sect =>
      ArrayUtils.removeEmpty(
        sect.map(curField => {
          const curFieldInfo = fields[curField];
          if (!curFieldInfo) {
            return null;
          }
          return showSkeletons ? (
            <Skeleton key={String(curField)} variant="rectangular" width="100%" height={40} />
          ) : (
            <FieldRendererWrapper
              key={String(curField)}
              id={curField.toString()}
              fieldInfo={curFieldInfo}
              onChange={onFieldChanged}
              value={value?.[curField]}
              defaultValue={defaultValue?.[curField]}
              isControlled={isControlled}
              error={errors?.[curField]}
            />
          );
        })
      )
    );
  }, [defaultValue, errors, fields, isControlled, layout?.fieldsBySections, onFieldChanged, showSkeletons, value]);

  return <Layout sections={sections} className={css.Layout} />;
};

const FieldRendererWrapper = React.memo(function Wrapper<T, K extends IBaseFieldInfo<T> = IBaseFieldInfo<T>>(
  props: Omit<IFieldRendererProps<T, K>, 'onChange' | 'fieldInfo'> & {
    id: string;
    fieldInfo: K;
    isControlled?: boolean;
    error?: TFieldError<T>;
  } & {
    onChange: (id: string, value: T) => void;
  }
) {
  const {onChange, id, fieldInfo, error, ...otherProps} = props;

  const onFieldChange = useCallback(
    (value: T) => {
      onChange(id, value);
    },
    [id, onChange]
  );

  return <fieldInfo.renderer onChange={onFieldChange} fieldInfo={fieldInfo} error={error} {...otherProps} />;
});
