import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {Attach} from './Attach';

describe('<Attach />', () => {
  it('upload file', async () => {
    const onChange = jest.fn();
    render(<Attach onFileChanged={onChange}>Прикрепить</Attach>);

    const ue = userEvent.setup();
    const uploadedFile = new File([], 'my_file.txt');
    await ue.upload(screen.getByLabelText('Прикрепить'), uploadedFile);
    screen.getByText('my_file.txt');
    expect(onChange).toHaveBeenLastCalledWith(uploadedFile);

    await ue.click(screen.getByTitle('Убрать файл'));
    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });
});
