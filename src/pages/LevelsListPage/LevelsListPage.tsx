import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {Button, Drawer, IconButton} from '@mui/material';
import {Close} from '@mui/icons-material';
import {Link} from 'react-router-dom';

import {AgGrid} from 'src/components/AgGrid/AgGrid';
import {useBooleanState} from 'src/hooks/useBooleanState';
import {LevelsListModel} from './levels-list.model';
import {LEVELS_LIST_COLUMNS} from './constants';
import {LevelEditWidget} from '../../widgets/LevelEditWidget/LevelEditWidget';
import {ROUTES} from 'src/constants';

import css from './LevelsListPage.module.scss';

export const LevelsListPage: FC = observer(() => {
  const [model] = useState(() => new LevelsListModel());
  const {loadItems, items} = model;
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>();
  const {state: showLevelDetails, toggleState: toggleLevelDetails, setState: setShowLevelDetails} = useBooleanState();

  const onLevelDetailsClicked = useCallback(
    (levelId?: string) => {
      if (selectedLevelId === levelId) {
        toggleLevelDetails();
      } else {
        setShowLevelDetails(true);
        setSelectedLevelId(levelId);
      }
    },
    [selectedLevelId, setShowLevelDetails, toggleLevelDetails]
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <>
      <div className={css.root}>
        <Link to={ROUTES.LEVELS.CREATE}>
          <Button color="primary" variant="contained" fullWidth>
            Добавить
          </Button>
        </Link>
        <AgGrid
          rowData={items}
          onShowDetails={onLevelDetailsClicked}
          columnDefs={LEVELS_LIST_COLUMNS}
          wrapperClassName={css.LevelsList}
          tooltipShowDelay={500}
        />
      </div>
      <Drawer open={showLevelDetails} anchor="left" variant="persistent">
        <div className={css.LevelDetails}>
          <IconButton onClick={toggleLevelDetails} className={css.CloseBtn}>
            <Close />
          </IconButton>
          <LevelEditWidget levelId={selectedLevelId} />
        </div>
      </Drawer>
    </>
  );
});
