import React, {FC} from 'react';
import {useParams} from 'react-router';

import {LevelEditWidget} from 'src/widgets/LevelEditWidget/LevelEditWidget';

export const LevelEditPage: FC = () => {
  const params = useParams<{levelId: string}>();

  return <LevelEditWidget levelId={params.levelId} />;
};
