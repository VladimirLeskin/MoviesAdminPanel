import React, {FC} from 'react';
import {Typography} from '@mui/material';

import styles from './Spinner.module.scss';

interface Props {
  className?: string;
}

export const Spinner: FC<Props> = ({className}) => {
  return (
    <Typography color="primary" className={`${[styles.Spinner, className].filter(Boolean).join(' ')}`}></Typography>
  );
};
