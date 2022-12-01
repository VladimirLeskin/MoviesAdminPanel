import {createStyles} from '@mui/styles';
import {Theme} from '@mui/material';

export const styles = (_theme: Theme) =>
  createStyles({
    root: {
      padding: '10px',
    },

    form: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    },

    fields: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 10px',
      marginBottom: 15,
      width: '70%',
    },

    control: {
      marginBottom: 10,
    },

    loader: {
      display: 'flex',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
