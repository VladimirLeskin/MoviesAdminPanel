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

export const QueryParams = {
  string,
  numeric,
  sort,
};
