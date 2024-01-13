import React, {FC, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router';
import {observer} from 'mobx-react';

import {ROUTES} from 'src/constants';
import {MovieEditWidget} from '../../widgets/MovieEditWidget/MovieEditWidget';

export const MovieEditPage: FC = observer(() => {
  const navigate = useNavigate();
  const {movieId} = useParams<{movieId: string}>();
  const onSaved = useCallback(
    (id: string) => {
      if (id !== movieId) {
        navigate(ROUTES.MOVIES.DETAILS.replace(':movieId', id));
      }
    },
    [movieId, navigate]
  );

  return <MovieEditWidget movieId={movieId} onSaved={onSaved} />;
});
