import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {withArrayInput} from './withArrayInput';
import {StringField} from '../StringField/StringField';

describe('withArrayInput', () => {
  it('fill several strings', async () => {
    const Component = withArrayInput(StringField, 'prefix');
    const onChange = jest.fn<void, Array<string[]>>();
    render(<Component defaultValue={[]} onChange={onChange} fieldInfo={{placeholder: 'Введите строку'}} />);

    const ue = userEvent.setup();
    await ue.click(screen.getByText('Добавить'));
    await ue.click(screen.getByText('Добавить'));

    await ue.type(screen.getAllByPlaceholderText('Введите строку')[0], 'строка1');
    await ue.type(screen.getAllByPlaceholderText('Введите строку')[1], 'строка2');

    expect(onChange).toHaveBeenLastCalledWith(['prefixстрока1', 'prefixстрока2']);
  });
});
