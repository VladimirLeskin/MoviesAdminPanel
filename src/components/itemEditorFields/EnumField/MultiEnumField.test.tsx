import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {MultiEnumField} from './MultiEnumField';
import {EFieldInfoType, IEnumMultiFieldInfo, IFieldRendererProps} from '../../../entries/FieldInfo';

describe('<MultiEnumField />', () => {
  const fieldInfo: IFieldRendererProps<Array<string | null>, IEnumMultiFieldInfo<string | null>>['fieldInfo'] = {
    id: '',
    title: '',
    type: EFieldInfoType.ENUM_MULTI,
    placeholder: 'Make your choice',
    options: [
      {value: null, label: 'Null'},
      {value: '0', label: 'Zero'},
    ],
  };

  it('select option with value === null', async () => {
    const onChange = jest.fn();

    render(<MultiEnumField<string | null> onChange={onChange} fieldInfo={fieldInfo} value={[]} />);
    const ue = userEvent.setup();
    await ue.click(screen.getByPlaceholderText('Make your choice'));
    await ue.click(screen.getByText('Null'));
    expect(onChange).toHaveBeenLastCalledWith([null]);
  });

  it('select option with value === 0', async () => {
    const onChange = jest.fn();

    render(<MultiEnumField<string | null> onChange={onChange} fieldInfo={fieldInfo} value={[null]} />);
    const ue = userEvent.setup();
    await ue.click(screen.getByPlaceholderText('Make your choice'));
    await ue.click(screen.getByText('Zero'));
    expect(onChange).toHaveBeenLastCalledWith([null, '0']);
  });
});
