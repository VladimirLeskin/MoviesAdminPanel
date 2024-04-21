import React from 'react';

import {TItemSchema} from './BaseEntity';
import {withArrayInput} from '../components/itemEditorFields/modificators';

export interface IFieldRendererProps<K, T extends IFieldInfo<K> = IFieldInfo<K>> {
  value?: K;
  defaultValue?: K;
  onChange: (value: K) => void;
  fieldInfo: Omit<T, 'renderer'>;
  isControlled?: boolean;
  error?: TFieldError<K>;
}

export type IFieldInfo<T> =
  | ISimpleFieldInfo<T>
  | IEnumFieldInfo<T>
  | IStructFieldInfo<T>
  | IEnumMultiFieldInfo<T extends Array<infer K> ? K : never>;

export enum EFieldInfoType {
  SIMPLE,
  ENUM,
  ENUM_MULTI,
  STRUCT,
}

export interface IBaseFieldInfo<T> {
  id?: string; // пока что это поле избыточно, возможно стоит удалить
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  renderer: React.ComponentType<IFieldRendererProps<T, IBaseFieldInfo<T>>>;
}

export interface ISimpleFieldInfo<T> extends IBaseFieldInfo<T> {
  type?: EFieldInfoType.SIMPLE;
}

export interface IEnumFieldInfo<T> extends IBaseFieldInfo<T> {
  type: EFieldInfoType.ENUM;
  options: Array<{value: T; label: string}>;
  renderer: React.ComponentType<IFieldRendererProps<T, IEnumFieldInfo<T>>>;
  isClearable: undefined extends T ? true : null extends T ? true : false;
}

export interface IEnumMultiFieldInfo<T> extends IBaseFieldInfo<T[]> {
  type: EFieldInfoType.ENUM_MULTI;
  options: Array<{value: T; label: string}>;
  renderer: React.ComponentType<IFieldRendererProps<T[], IEnumMultiFieldInfo<T>>>;
}

export interface IStructFieldInfo<T> extends IBaseFieldInfo<T> {
  type: EFieldInfoType.STRUCT;
  subFields: TItemSchema<T>;
  renderer: React.ComponentType<IFieldRendererProps<T, IStructFieldInfo<T>>>;
  layout?: ILayoutSettings<T>;
}

export interface ILayoutSettings<T> {
  layoutType: React.ComponentType<TLayoutComponentProps>;
  fieldsBySections?: (keyof T)[][];
}

export type TLayoutComponentProps = {sections: React.ReactNode[][]} & JSX.IntrinsicElements['div'];

export type TDataErrors<T> = {
  [K in keyof T]: TFieldError<T[K]>;
};

export type TFieldError<T> = {
  error: string;
  subFields?: T extends object ? TDataErrors<T> : never;
};

export function getMultiFieldInfo<T>(f: ISimpleFieldInfo<T>, defValue: T): IBaseFieldInfo<T[]>;
export function getMultiFieldInfo<T>(f: IStructFieldInfo<T>, defValue: T): IBaseFieldInfo<T[]>;
export function getMultiFieldInfo<T>(f: IBaseFieldInfo<T>, defValue: T): IBaseFieldInfo<T[]> {
  return {
    ...f,
    renderer: withArrayInput<T>(f.renderer, defValue),
  };
}
