import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {EnumField} from './EnumField';
import {EFieldInfoType, IEnumFieldInfo, IFieldRendererProps} from '../../../entries/FieldInfo';

describe('<EnumField />', () => {
  const fieldInfo: IFieldRendererProps<number | null, IEnumFieldInfo<number | null>>['fieldInfo'] = {
    id: '',
    title: '',
    type: EFieldInfoType.ENUM,
    isClearable: true,
    options: [
      {value: null, label: 'Null'},
      {value: 0, label: 'Zero'},
    ],
  };

  it('select option with value === null', async () => {
    const onChange = jest.fn();

    render(<EnumField<number | null> onChange={onChange} fieldInfo={fieldInfo} value={0} />);
    const ue = userEvent.setup();
    await ue.click(screen.getByDisplayValue('Zero'));
    await ue.click(screen.getByText('Null'));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('select option with value === 0', async () => {
    const onChange = jest.fn();

    render(<EnumField<number | null> onChange={onChange} fieldInfo={fieldInfo} value={null} />);
    const ue = userEvent.setup();
    await ue.click(screen.getByDisplayValue('Null'));
    await ue.click(screen.getByText('Zero'));
    expect(onChange).toHaveBeenLastCalledWith(0);
  });
});
