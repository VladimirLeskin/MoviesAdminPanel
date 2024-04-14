export type TObject = Record<string, any>;

export type TSelectOption<T> = {label: string; value: T};

export interface ISortState {
  field: string;
  order: 'asc' | 'desc';
}
