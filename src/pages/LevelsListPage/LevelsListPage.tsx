import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {Button, Drawer, IconButton, Switch} from '@mui/material';
import {Close} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import {CustomCellRendererProps} from 'ag-grid-react';

import {AgGrid} from 'src/components/AgGrid/AgGrid';
import {useBooleanState} from 'src/hooks/useBooleanState';
import {useTitleUpdate} from 'src/hooks/useTitleUpdate';
import {LevelsListModel} from './levels-list.model';
import {LEVELS_LIST_COLUMNS} from './constants';
import {LevelEditWidget} from '../../widgets/LevelEditWidget/LevelEditWidget';
import {ROUTES} from 'src/constants';
import {Spinner} from '../../components/Spinner/Spinner';
import {Pagination} from '../../components/Pagination/Pagination';
import {ILevelListItemDto} from '../../api/dto/LevelDto';

import css from './LevelsListPage.module.scss';

export const LevelsListPage: FC = observer(() => {
  useTitleUpdate('Список уровней');
  const [model] = useState(() => new LevelsListModel());
  const {init, isLoading, total, pagination, items, onPaginationChanged} = model;
  const [selectedLevelId, setSelectedLevelId] = useState<number | undefined>();
  const {state: showLevelDetails, toggleState: toggleLevelDetails, setState: setShowLevelDetails} = useBooleanState();

  const onLevelDetailsClicked = useCallback(
    (levelId?: number) => {
      if (selectedLevelId === levelId) {
        toggleLevelDetails();
      } else {
        setShowLevelDetails(true);
        setSelectedLevelId(levelId);
      }
    },
    [selectedLevelId, setShowLevelDetails, toggleLevelDetails]
  );

  const columns = useMemo(() => {
    return LEVELS_LIST_COLUMNS.concat({
      colId: 'active',
      headerName: 'Опубл.',
      field: 'active',
      width: 80,
      sortable: true,
      resizable: false,
      cellClass: css.CellWithoutPaddings,
      cellRenderer: ({data}: CustomCellRendererProps<ILevelListItemDto>) => {
        if (data) {
          const onPublish = () => {
            model.onPublish(data.id.toString(), !data.active);
          };
          return <Switch checked={data.active} onChange={onPublish} />;
        }
        return null;
      },
    });
  }, [model]);

  useEffect(() => {
    init();
  }, [init]);

  const paginationContainer = (
    <div className={css.PaginationContainer}>
      <Spinner className={!isLoading && css.LoaderHidden} />
      <Pagination {...pagination} itemsTotal={total} onChange={onPaginationChanged} />
    </div>
  );

  return (
    <>
      <div className={css.root}>
        <Link to={ROUTES.LEVELS.CREATE}>
          <Button color="primary" variant="contained" fullWidth>
            Добавить
          </Button>
        </Link>
        {paginationContainer}
        <AgGrid
          rowData={items}
          onShowDetails={onLevelDetailsClicked}
          columnDefs={columns}
          className={css.LevelsList}
          tooltipShowDelay={500}
        />
        {paginationContainer}
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
