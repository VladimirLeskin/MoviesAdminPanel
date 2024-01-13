import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {DateField} from './DateField';

describe('<DateField />', () => {
  it('change value', async () => {
    const onChange = jest.fn();
    const fieldInfo = {id: 'date', placeholder: 'dateFieldPlaceholder', title: 'Date Field'};
    render(<DateField onChange={onChange} fieldInfo={fieldInfo} defaultValue={new Date(0)} />);
    const ue = userEvent.setup();

    // открываем календарь
    await ue.click(screen.getByRole('button'));
    // выбираем 23-е число
    await ue.click(screen.getByText('23'));
    // ожидаем, что дата стала 23.01.1970
    expect(onChange).toHaveBeenLastCalledWith(new Date(1970, 0, 23));

    await ue.clear(screen.getByLabelText(fieldInfo.title));
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });
});
