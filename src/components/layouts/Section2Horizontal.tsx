import React from 'react';
import {Box, Divider} from '@mui/material';

import {TLayoutComponentProps} from 'src/entries/FieldInfo';

export const Section2Horizontal = React.forwardRef<HTMLDivElement, TLayoutComponentProps>(
  ({sections, ...otherProps}, ref) => {
    return (
      <Box display="grid" gridTemplateColumns="1fr 2px 1fr" gap={1} padding={1} {...otherProps} ref={ref}>
        <Box display="flex" flexDirection="column" gap={1}>
          {sections[0]}
        </Box>
        <Divider orientation="vertical" />
        <Box display="flex" flexDirection="column" gap={1}>
          {sections[1]}
        </Box>
      </Box>
    );
  }
);
