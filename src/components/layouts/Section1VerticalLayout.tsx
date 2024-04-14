import React from 'react';
import {Box} from '@mui/material';

import {TLayoutComponentProps} from 'src/entries/FieldInfo';

export const Section1VerticalLayout = React.forwardRef<HTMLDivElement, TLayoutComponentProps>(
  ({sections, ...otherProps}, ref) => {
    return (
      <Box display="flex" flexDirection="column" gap={1} padding={1} {...otherProps} ref={ref}>
        {sections[0]?.map(elm => elm)}
      </Box>
    );
  }
);
