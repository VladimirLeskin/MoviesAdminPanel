import React, {useCallback, useState} from 'react';
import {IconButton} from '@mui/material';
import Button from '@mui/material/Button';
import cn from 'classnames';
import {Clear} from '@mui/icons-material';
import {ButtonProps} from '@mui/material/Button/Button';

import css from './Attach.module.scss';

interface Props extends ButtonProps<'label'> {
  onFileChanged: (file: File | undefined) => void;
  showFileName?: boolean;
}

export const Attach = ({onFileChanged, showFileName = true, className, children, ...otherProps}: Props) => {
  const [currentKey, setCurrentKey] = useState(new Date().getTime());
  const [selectedFileName, setSelectedFileName] = useState('');

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.item(0);
      setSelectedFileName(file?.name ?? '');
      onFileChanged(file ?? undefined);
      setCurrentKey(new Date().getTime());
    },
    [onFileChanged]
  );

  const clearFile = useCallback(() => {
    onFileChanged(undefined);
    setSelectedFileName('');
  }, [onFileChanged]);

  return (
    <>
      <Button component="label" variant="contained" className={cn(css.root, className)} {...otherProps}>
        {children ?? 'Файл'}
        <input key={currentKey} type="file" onChange={onChange} />
      </Button>
      {showFileName && selectedFileName && (
        <span className={css.SelectedFile}>
          <span className={css.SelectedFileName}>{selectedFileName}</span>
          <IconButton size="small" onClick={clearFile} title="Убрать файл">
            <Clear fontSize="small" />
          </IconButton>
        </span>
      )}
    </>
  );
};
