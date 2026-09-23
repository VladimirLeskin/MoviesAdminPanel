import {SxProps, Theme} from '@mui/material';

export function drawerPaperWidth(maxWidthPx: number): SxProps<Theme> {
  return {
    width: `min(${maxWidthPx}px, calc(100vw - 32px))`,
    maxWidth: 'calc(100vw - 32px)',
  };
}
