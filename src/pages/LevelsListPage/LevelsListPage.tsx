import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {Button, CircularProgress, Drawer, IconButton, Switch, useMediaQuery} from '@mui/material';
import {Close, Delete} from '@mui/icons-material';
import {toast} from 'react-toastify';
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
import {ILevelListItemDto} from './types';
import {authModel} from '../../models/AuthModel';
import {EUserPermissions} from '../../api/Auth';
import {drawerPaperWidth} from '../../styles/drawer';

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

  const canDeleteLevel = authModel.hasPermission(EUserPermissions.deleteLevel);
  const isMobile = useMediaQuery('(max-width:768px)');

  const onLevelDeleted = useCallback(() => {
    setShowLevelDetails(false);
    setSelectedLevelId(undefined);
    model.reload();
  }, [model, setShowLevelDetails]);

  const columns = useMemo(() => {
    const nextColumns = LEVELS_LIST_COLUMNS.concat({
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
            model.onPublish(data.id, !data.active);
          };
          return <Switch checked={data.active} onChange={onPublish} />;
        }
        return null;
      },
    });

    if (canDeleteLevel) {
      nextColumns.push({
        colId: 'delete',
        headerName: '',
        width: 56,
        sortable: false,
        resizable: false,
        cellClass: css.CellWithoutPaddings,
        cellRenderer: observer(({data}: CustomCellRendererProps<ILevelListItemDto>) => {
          if (!data) {
            return null;
          }
          const isDeleting = model.deletingIds.includes(data.id);
          const onDelete = () => {
            if (isDeleting) {
              return;
            }
            if (!confirm(`Удалить уровень${data.title ? ` «${data.title}»` : ''}?`)) {
              return;
            }
            model.deleteItem(data.id).then(deleted => {
              if (!deleted) {
                return;
              }
              toast.success('Уровень удалён');
              if (selectedLevelId === data.id) {
                setShowLevelDetails(false);
                setSelectedLevelId(undefined);
              }
            });
          };
          return (
            <IconButton onClick={onDelete} size="small" color="error" title="Удалить" disabled={isDeleting}>
              {isDeleting ? <CircularProgress size={18} color="inherit" /> : <Delete fontSize="small" />}
            </IconButton>
          );
        }),
      });
    }

    return nextColumns;
  }, [canDeleteLevel, model, selectedLevelId, setShowLevelDetails]);

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
      <Drawer
        open={showLevelDetails}
        anchor="left"
        variant={isMobile ? 'temporary' : 'persistent'}
        onClose={toggleLevelDetails}
        PaperProps={{sx: drawerPaperWidth(640)}}
      >
        <div className={css.LevelDetails}>
          <IconButton onClick={toggleLevelDetails} className={css.CloseBtn}>
            <Close />
          </IconButton>
          <LevelEditWidget levelId={selectedLevelId} onDeleted={onLevelDeleted} />
        </div>
      </Drawer>
    </>
  );
});
