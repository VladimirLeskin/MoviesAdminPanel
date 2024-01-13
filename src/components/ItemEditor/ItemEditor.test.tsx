import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {ItemEditor} from './ItemEditor';
import {EFieldInfoType, IEnumMultiFieldInfo} from '../../entries/FieldInfo';
import {BooleanField, EnumField, MultiEnumField, NumericField, StringField, StructField} from '../itemEditorFields';
import {Section2Horizontal} from '../layouts/Section2Horizontal';
import {TItemSchema} from '../../entries/BaseEntity';

interface ISubObj {
  subField1: string;
  subField2: number[];
}

interface Obj {
  id: string;
  name: string;
  enum?: number;
  disabledEnum: string;
  numeric?: number;
  'multi-enum': number[];
  boolVal: boolean;
  tripleBoolVal: boolean | null;
  complex_field: ISubObj;
}

describe('<ItemEditor />', () => {
  it('render item by schema', async () => {
    const obj: Obj = {
      id: '123',
      name: "Obj's Name",
      enum: 1,
      disabledEnum: 'option1',
      numeric: undefined as number | undefined,
      'multi-enum': [1, 2],
      boolVal: true,
      tripleBoolVal: false as boolean | null,
      complex_field: {
        subField1: '999',
        subField2: [3],
      },
    };

    const onChange = jest.fn();

    render(<ItemEditor<Obj> fields={getSchema()} defaultValue={obj} onChange={onChange} />);

    const uv = userEvent.setup();
    await uv.type(screen.getByDisplayValue('999'), '888');
    await uv.type(screen.getByDisplayValue("Obj's Name"), ' hahaha');

    expect(onChange).toHaveBeenLastCalledWith({
      ...obj,
      name: "Obj's Name hahaha",
      complex_field: {...obj.complex_field, subField1: '999888'},
    });
  });
});

function getSchema(): TItemSchema<Obj> {
  return {
    id: {id: 'id', title: 'ID', renderer: StringField},
    name: {id: 'name', title: 'Name', renderer: StringField},
    numeric: {id: 'numeric', title: 'Numeric', renderer: NumericField},
    boolVal: {id: 'boolVal', title: 'Boolean', renderer: BooleanField},
    tripleBoolVal: {
      id: 'tripleBoolVal',
      title: 'Boolean2',
      renderer: EnumField,
      options: [
        {value: true, label: 'True'},
        {value: false, label: 'False'},
        {value: null, label: 'Undefined'},
      ],
    },
    disabledEnum: {
      id: 'disabledEnum',
      title: 'Disabled Enum',
      type: EFieldInfoType.ENUM,
      renderer: EnumField,
      disabled: true,
      isClearable: false,
      options: [{value: 'option1', label: 'option1'}],
    },
    enum: {
      id: 'enum',
      title: 'Enum',
      type: EFieldInfoType.ENUM,
      renderer: EnumField,
      isClearable: true,
      options: [
        {value: 1, label: 'One'},
        {value: 2, label: 'Two'},
      ],
    },
    'multi-enum': {
      id: 'multi-enum',
      type: EFieldInfoType.ENUM_MULTI,
      title: 'Multi Enum',
      renderer: MultiEnumField,
      options: [
        {value: 1, label: 'One'},
        {value: 2, label: 'Two'},
      ],
    },
    complex_field: {
      id: 'complex_field',
      title: 'Complex Field',
      renderer: StructField,
      layout: {
        layoutType: Section2Horizontal,
        fieldsBySections: [['subField2'], ['subField1']] as (keyof ISubObj)[][],
      },
      subFields: {
        subField1: {
          id: 'subField1',
          title: 'SubField1',
          renderer: StringField,
        },
        subField2: {
          id: 'subField2',
          title: 'SubField2',
          type: EFieldInfoType.ENUM_MULTI,
          renderer: MultiEnumField,
          options: [
            {value: 3, label: 'SubThree'},
            {value: 4, label: 'SubFour'},
            {value: 5, label: 'SubFive'},
          ],
        } as IEnumMultiFieldInfo<number>,
      },
    },
  };
}
