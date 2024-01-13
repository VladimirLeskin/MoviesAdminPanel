import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {BooleanField} from './BooleanField';

describe('<BooleanField />', () => {
  it('change value as uncontrolled component', async () => {
    const onChange = jest.fn();
    const fieldInfo = {id: 'bool', title: 'Bool Field'};
    render(<BooleanField onChange={onChange} fieldInfo={fieldInfo} defaultValue={false} />);
    const ue = userEvent.setup();

    const checkbox: HTMLInputElement = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await ue.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(true);

    expect(checkbox).toBeChecked();
    await ue.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('change value as controlled component', async () => {
    const onChange = jest.fn();
    const fieldInfo = {id: 'bool', title: 'Bool Field'};
    const {rerender} = render(<BooleanField onChange={onChange} fieldInfo={fieldInfo} value={false} />);
    const ue = userEvent.setup();

    const checkbox: HTMLInputElement = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await ue.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(true);

    expect(checkbox).not.toBeChecked();
    await ue.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(true);

    rerender(<BooleanField onChange={onChange} fieldInfo={fieldInfo} value />);
    expect(checkbox).toBeChecked();
    await ue.click(checkbox);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });
});
