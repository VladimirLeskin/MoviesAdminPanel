import React, {FC, useCallback} from 'react';
import {TablePagination} from '@mui/material';

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
  const pageSize = initPageSize ?? pageSizeOptions[0];

  const onPageChange = useCallback((_, newPage) => onChange({pageSize, page: newPage}), [onChange, pageSize]);
  const onRowsPerPageChange = useCallback(
    e =>
      onChange({
        page: 0,
        pageSize: parseInt(e.target.value, 10),
      }),
    [onChange]
  );

  return (
    <TablePagination
      component="div"
      classes={css}
      showFirstButton
      showLastButton
      page={page}
      rowsPerPageOptions={pageSizeOptions}
      rowsPerPage={pageSize}
      count={itemsTotal}
      onRowsPerPageChange={onRowsPerPageChange}
      onPageChange={onPageChange}
      {...others}
    />
  );
};
