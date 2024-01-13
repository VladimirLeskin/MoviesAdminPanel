import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {NumericField} from './NumericField';

describe('<NumericField />', () => {
  it.each([
    {type: '98', expected: 98},
    {type: '98.009', expected: 98.009},
    {type: '11.', expected: 11},
    {type: '11,', expected: 11},
    {type: '11,3434', expected: 11.3434},
    {type: '42where-are-the-dwemers?', expected: 42},
    {type: '+42', expected: 42},
    {type: '-42', expected: -42},
  ])('typing "$type" should become $expected', async ({type, expected}) => {
    const onChange = jest.fn();
    render(<NumericField onChange={onChange} fieldInfo={{id: '', title: 'полюшко'}} />);
    const input = screen.getByLabelText('полюшко');
    const ue = userEvent.setup();
    await ue.type(input, type);

    expect(onChange).toHaveBeenLastCalledWith(expected);
  });

  it('return number in onChange', async () => {
    const onChange = jest.fn();
    render(<NumericField onChange={onChange} fieldInfo={{id: '', title: ''}} defaultValue={58} />);

    const ue = userEvent.setup();
    const input = screen.getByDisplayValue('58');
    await ue.type(input, '98');
    expect(onChange).toHaveBeenLastCalledWith(5898);

    await ue.clear(input);
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });
});
