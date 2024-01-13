import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {StructOneOfField} from './StructOneOfField';
import {EFieldInfoType, IStructFieldInfo} from 'src/entries/FieldInfo';
import {NumericField} from '../NumericField/NumericField';
import {StringField} from '../StringField/StringField';

describe('<StructOneOfField />', () => {
  it('save values', async () => {
    const defaultValue = {businessId: 123};
    const onChange = jest.fn();
    const fieldInfo: Omit<IStructFieldInfo<{businessId?: number; realSupplierId?: string}>, 'renderer'> = {
      title: 'Business',
      type: EFieldInfoType.STRUCT,
      subFields: {
        businessId: {title: 'Business ID', renderer: NumericField},
        realSupplierId: {renderer: StringField},
      },
    };

    render(<StructOneOfField defaultValue={defaultValue} onChange={onChange} fieldInfo={fieldInfo} />);

    const ue = userEvent.setup();
    await ue.type(screen.getByRole('textbox'), '45');
    await ue.click(screen.getByText(fieldInfo.subFields.businessId!.title!));
    await ue.click(screen.getByText('realSupplierId'));
    await ue.type(screen.getByRole('textbox'), 'my-supplier-id');
    expect(onChange).toHaveBeenLastCalledWith({realSupplierId: 'my-supplier-id'});
    await ue.click(screen.getByText('realSupplierId'));
    await ue.click(screen.getByText(fieldInfo.subFields.businessId!.title!));

    expect(onChange).toHaveBeenLastCalledWith({businessId: 12345});
  });

  it('throw error', () => {
    const onChange = jest.fn();
    const fieldInfo: Omit<IStructFieldInfo<{businessId?: number; realSupplierId?: string}>, 'renderer'> = {
      title: 'Business',
      type: EFieldInfoType.STRUCT,
      subFields: {},
    };

    expect(() => {
      render(<StructOneOfField onChange={onChange} fieldInfo={fieldInfo} />);
    }).toThrowError();
  });
});
