import React, {FC, useCallback} from 'react';
import {TablePagination, useMediaQuery} from '@mui/material';

import css from './Pagination.module.scss';

interface Pagination {
  page: number;
  pageSize: number;
}

interface Props {
  page?: number; // from 0
  pageSize?: number;
  itemsTotal?: number;
  pageSizeOptions?: number[];

  onChange: (pagination: Pagination) => void;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const Pagination: FC<Props> = props => {
  const {
    page = 0,
    itemsTotal = -1,
    onChange,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    pageSize: initPageSize,
    ...others
  } = props;
  const pageSize = initPageSize ?? pageSizeOptions[0] ?? 0;
  const isCompact = useMediaQuery('(max-width:600px)');

  const onPageChange = useCallback(
    (_: unknown, newPage: number) =>
      onChange({
        pageSize,
        page: newPage,
      }),
    [onChange, pageSize]
  );
  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        page: 0,
        pageSize: +e.target.value,
      }),
    [onChange]
  );

  return (
    <TablePagination
      component="div"
      classes={css}
      showFirstButton={!isCompact}
      showLastButton={!isCompact}
      page={page}
      rowsPerPageOptions={pageSizeOptions}
      rowsPerPage={pageSize ?? -1}
      count={itemsTotal}
      onRowsPerPageChange={onRowsPerPageChange}
      onPageChange={onPageChange}
      {...others}
    />
  );
};
