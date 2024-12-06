import {ParamConfig} from './types';
import {ISortState} from '../../type';

function numeric(): ParamConfig<number | undefined>;
function numeric(defaultValue: number): ParamConfig<number>;
function numeric(defaultValue?: number): ParamConfig<number | undefined> {
  return {
    decode: str => (str != null ? +str : defaultValue),
    encode: num => num?.toString(),
  };
}

function string(): ParamConfig<string | undefined>;
function string(defaultValue: string): ParamConfig<string>;
function string(defaultValue?: string): ParamConfig<string | undefined> {
  return {
    decode: str => (str != null ? str || undefined : defaultValue),
    encode: str => str,
  };
}

function boolean(): ParamConfig<boolean | undefined>;
function boolean(defaultValue: boolean): ParamConfig<boolean>;
function boolean(defaultValue?: boolean): ParamConfig<boolean | undefined> {
  return {
    decode: str => (str != null ? str === 'true' : defaultValue),
    encode: str => (str == null ? undefined : str.toString()),
  };
}

function sort(): ParamConfig<ISortState[] | undefined> {
  return {
    decode: (str: string | string[] | undefined) => {
      if (!str) {
        return undefined;
      }
      return ([] as string[]).concat(str).map(field => {
        if (field.startsWith('-')) {
          return {field: field.slice(1), order: 'desc'};
        }
        return {field, order: 'asc'};
      });
    },
    encode: sort => sort?.map(({field, order}) => `${order === 'desc' ? '-' : ''}${field}`),
  };
}

function arrayOfString(): ParamConfig<string[] | undefined> {
  return {
    decode: (str: string | string[] | undefined) => {
      if (!str) {
        return undefined;
      }
      return ([] as string[]).concat(str.toString().split(','));
    },
    encode: strings => (strings ? strings.join(',') || undefined : undefined),
  };
}

function arrayOfNumbers(): ParamConfig<number[] | undefined> {
  return {
    decode: (str: string | string[] | undefined) => {
      if (!str) {
        return undefined;
      }
      return ([] as string[])
        .concat(str.toString().split(','))
        .map(Number)
        .filter(v => !Number.isNaN(v));
    },
    encode: numbers => (numbers ? numbers.map(String).join(',') || undefined : undefined),
  };
}

export const QueryParams = {
  string,
  numeric,
  boolean,
  arrayOfString,
  arrayOfNumbers,
  sort,
};
