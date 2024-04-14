import React from 'react';
import {Box} from '@mui/material';

import {TLayoutComponentProps} from 'src/entries/FieldInfo';

export const Section1HorizontalLayout = React.forwardRef<HTMLDivElement, TLayoutComponentProps>(
  ({sections, ...otherProps}, ref) => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        flexWrap="wrap"
        gap={1}
        padding={1}
        {...otherProps}
        ref={ref}
      >
        {sections[0]?.map(elm => elm)}
      </Box>
    );
  }
);
