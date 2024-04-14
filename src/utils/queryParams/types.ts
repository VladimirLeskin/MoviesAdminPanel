export type ParamConfig<TValue> = {
  decode: (str: string | undefined) => TValue;
  encode: (v: TValue) => string | string[] | undefined;
};

export type IQueryConfig<TValues extends object> = {
  [Key in keyof TValues]: ParamConfig<TValues[Key]>;
};
