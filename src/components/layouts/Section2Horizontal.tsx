import React from 'react';
import {Box, Divider} from '@mui/material';
import classNames from 'classnames';

import {TLayoutComponentProps} from 'src/entries/FieldInfo';

import css from './Section2Horizontal.module.scss';

export const Section2Horizontal = React.forwardRef<HTMLDivElement, TLayoutComponentProps>(
  ({sections, className, ...otherProps}, ref) => {
    return (
      <Box className={classNames(css.root, className)} {...otherProps} ref={ref}>
        <Box className={css.column}>{sections[0]}</Box>
        <Divider className={css.divider} orientation="vertical" />
        <Box className={css.column}>{sections[1]}</Box>
      </Box>
    );
  }
);
