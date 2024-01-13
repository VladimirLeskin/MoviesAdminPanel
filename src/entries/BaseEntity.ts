import {IFieldInfo, ILayoutSettings} from './FieldInfo';

export type TBaseEntity = {id?: number | string | symbol | object | undefined};

export type TItemSchema<T> = {
  [K in keyof T]?: IFieldInfo<T[K]>;
};

export interface IItemEditorConfig<T> {
  fields: TItemSchema<T>;
  layout?: ILayoutSettings<T>;
}
