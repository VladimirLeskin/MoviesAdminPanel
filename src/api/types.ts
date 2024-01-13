export interface IPagedResponse<T> {
  items: T[];
  meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}
