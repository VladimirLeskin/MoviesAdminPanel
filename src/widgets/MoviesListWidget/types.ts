import {IMovieFilter} from './components/filter/MoviesListFilter';
import {IListPagination} from '../../models/ItemsListModel';
import {ISortState} from '../../type';

export interface MoviesListWidgetParams {
  filter?: IMovieFilter;
  pagination?: IListPagination;
  sortState?: ISortState[];
}
