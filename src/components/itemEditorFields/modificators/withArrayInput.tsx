import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FormControl, FormLabel} from '@mui/material';

import {ArrayInput, InputProps} from 'src/components/ArrayInput';
import {IFieldRendererProps} from 'src/entries/FieldInfo';

export function withArrayInput<T>(
  renderer: React.ComponentType<IFieldRendererProps<T>>,
  inputDefaultValue: T
): React.ComponentType<IFieldRendererProps<T[]>> {
  // eslint-disable-next-line react/display-name
  return (props: IFieldRendererProps<T[]>) => {
    const {fieldInfo, onChange} = props;
    const [value, setValue] = useState<T[]>(() => getValueStateFromProps(props));

    const onArrayInputChanged = useCallback(
      (v: T[]) => {
        onChange(v);
        setValue(v);
      },
      [onChange]
    );

    const InputComponent = useMemo(() => getInputRender(renderer, fieldInfo), [fieldInfo]);

    useEffect(() => {
      setValue(getValueStateFromProps(props));
    }, [props]);

    return (
      <FormControl required={fieldInfo.required}>
        <FormLabel>{fieldInfo.title}</FormLabel>
        <ArrayInput
          value={value}
          defaultValue={inputDefaultValue}
          disabled={fieldInfo.disabled}
          onChange={onArrayInputChanged}
          inputRender={InputComponent}
        />
      </FormControl>
    );
  };
}

const emptyArr: any[] = [];

function getValueStateFromProps<T>({value, defaultValue, isControlled}: IFieldRendererProps<T[]>): T[] {
  return (value || isControlled ? emptyArr : defaultValue) || emptyArr;
}

function getInputRender<T>(
  Renderer: React.ComponentType<IFieldRendererProps<T>>,
  fieldInfo: IFieldRendererProps<T>['fieldInfo']
) {
  // eslint-disable-next-line react/display-name
  return (props: InputProps<T>) => {
    return <Renderer value={props.value} onChange={props.onChange} fieldInfo={{...fieldInfo, title: ''}} />;
  };
}
