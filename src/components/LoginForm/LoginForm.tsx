import React, {FC, useCallback, useState} from 'react';
import {Button, FormControl, TextField} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {styles} from './styles';

interface ILoginFormProps {
  onLogin: (login: string, password: string) => Promise<boolean>;
  onSuccess?: () => void;
}

const useStyles = makeStyles(styles);

export const LoginForm: FC<ILoginFormProps> = props => {
  const classes = useStyles(props);
  const {onLogin, onSuccess} = props;

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      onLogin(login, password)
        .then(result => {
          if (result) {
            onSuccess?.();
          } else {
            setError('Неверный логин или пароль');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [login, onLogin, onSuccess, password]
  );

  return (
    <div className={classes.root}>
      <form onSubmit={onSubmit} className={classes.form}>
        {isLoading && <div className={classes.loader}>Загрузка...</div>}
        <div className={classes.fields}>
          <FormControl className={classes.control}>
            <TextField
              label="Login"
              name="login"
              variant="outlined"
              value={login}
              error={!!error}
              helperText={error}
              onChange={e => {
                setLogin(e.target.value);
              }}
            />
          </FormControl>
          <FormControl className={classes.control}>
            <TextField
              label="Password"
              name="password"
              variant="outlined"
              type="password"
              value={password}
              error={!!error}
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>
        </div>
        <Button type="submit" variant="contained" disabled={!login || !password}>
          Войти
        </Button>
      </form>
    </div>
  );
};
