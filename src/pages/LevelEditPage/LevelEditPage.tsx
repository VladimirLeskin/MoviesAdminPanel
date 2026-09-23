import React, {FC, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router';

import {LevelEditWidget} from 'src/widgets/LevelEditWidget/LevelEditWidget';
import {ROUTES} from '../../constants';

export const LevelEditPage: FC = () => {
  const params = useParams<{levelId: string}>();
  const navigate = useNavigate();
  const onSaved = useCallback(
    (id: number) => {
      if (id.toString() !== params.levelId) {
        navigate(ROUTES.LEVELS.DETAILS.replace(':levelId', id.toString()));
      }
    },
    [navigate, params.levelId]
  );
  const onDeleted = useCallback(() => {
    navigate(ROUTES.LEVELS.LIST);
  }, [navigate]);
  return (
    <LevelEditWidget levelId={params.levelId ? +params.levelId : undefined} onSaved={onSaved} onDeleted={onDeleted} />
  );
};
