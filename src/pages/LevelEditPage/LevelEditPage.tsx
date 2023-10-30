import React, {FC, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router';

import {LevelEditWidget} from 'src/widgets/LevelEditWidget/LevelEditWidget';
import {ROUTES} from '../../constants';

export const LevelEditPage: FC = () => {
  const params = useParams<{levelId: string}>();
  const navigate = useNavigate();
  const onSaved = useCallback(
    (id: string) => {
      if (id !== params.levelId) {
        navigate(ROUTES.LEVELS.DETAILS.replace(':levelId', id));
      }
    },
    [navigate, params.levelId]
  );
  return <LevelEditWidget levelId={params.levelId} onSaved={onSaved} />;
};
