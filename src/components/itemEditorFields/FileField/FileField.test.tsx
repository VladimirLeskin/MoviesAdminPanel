import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {FileField} from './FileField';

describe('<FileField />', () => {
  it('renders without errors', async () => {
    const fieldInfo = {title: 'File field'};
    const onChange = jest.fn();
    render(<FileField fieldInfo={fieldInfo} onChange={onChange} />);

    const ue = userEvent.setup();
    const uploadedFile = new File([], 'my_file.txt');
    await ue.upload(screen.getByLabelText('Файл'), uploadedFile);
    screen.getByText('my_file.txt');
    expect(onChange).toHaveBeenLastCalledWith(uploadedFile);
  });
});
