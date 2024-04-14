import {action, AnnotationsMap, computed, makeObservable, observable, override, runInAction} from 'mobx';
import {AxiosResponse} from 'axios';
import {IPagedResponse} from '../api/types';
import {ISortState} from '../type';

type TBaseItem = {id: unknown};
type TMobXAnnotationsMap<T extends TBaseItem, Filters> = AnnotationsMap<
  ItemsListModel<T, Filters>,
  '_items' | 'inited'
>;

export interface IListPagination {
  page?: number; // from 0
  pageSize: number;
}

export interface IApiEndPoints<T extends TBaseItem, Filters> {
  load: (v?: IRequestPayload<Filters>) => Promise<AxiosResponse<IPagedResponse<T>>>;
  delete: (id: T['id']) => Promise<boolean | undefined>;
}

interface IRequestPayload<Filters> {
  filter?: Filters;
  pagination?: IListPagination;
  sortState?: ISortState[];
}

export abstract class ItemsListModel<T extends TBaseItem, Filters> {
  protected inited: boolean = false;
  protected _items: T[] = [];
  protected lastLoadPayload: IRequestPayload<Filters> | undefined = undefined;

  public filter: Filters | undefined = undefined;
  public pagination: IListPagination = {pageSize: 50};
  public sortState: ISortState[] = [];
  public total: number = 0;
  public isLoading = false;

  private lastRequestId?: Symbol;

  constructor() {
    makeObservable(this, ItemsListModel.getMobxAnnotations(), {autoBind: true, deep: false});
  }

  public reload() {
    return this.loadItems({filter: this.filter, pagination: this.pagination, sortState: this.sortState});
  }

  public loadItems(payload?: IRequestPayload<Filters>) {
    this.lastLoadPayload = payload;
    const currentRequestId = Symbol();
    this.lastRequestId = currentRequestId;
    this.isLoading = true;
    this.apiEndPoints
      .load(payload)
      .then(resp => {
        if (currentRequestId === this.lastRequestId) {
          runInAction(() => {
            this.total = resp.data.meta.totalCount;
            this.pagination.pageSize = resp.data.meta.perPage;
          });
          this.setItems(resp.data.items);
        }
      })
      .finally(() => {
        runInAction(() => {
          this.isLoading = false;
        });
      });
  }

  public onFilterChanged(filter: Filters) {
    this.filter = filter;
    this.pagination = {...this.pagination, page: 0};
    this.reload();
  }

  public onPaginationChanged(pagination: IListPagination) {
    this.pagination = pagination;
    this.reload();
  }

  public onSortChanged(sortState: ISortState[]) {
    this.sortState = sortState;
    this.reload();
  }

  public init() {
    if (!this.inited) {
      this.reload();
    }
    this.inited = true;
  }

  public get items(): T[] {
    return this._items;
  }

  public setItems(value: T[]) {
    this._items = value;
  }

  public async deleteItem(value: T['id']) {
    try {
      await this.apiEndPoints.delete(value);
      this.loadItems(this.lastLoadPayload);
      return true;
    } catch {
      return false;
    }
  }

  private static getMobxAnnotations<T extends TBaseItem, Filters>(): TMobXAnnotationsMap<T, Filters> {
    return {
      reload: action.bound,
      deleteItem: action.bound,
      setItems: action.bound,
      onFilterChanged: action.bound,
      onPaginationChanged: action.bound,
      onSortChanged: action.bound,
      init: action.bound,
      items: computed,
      _items: observable,
      inited: observable,
      isLoading: observable,
      total: observable,
      filter: observable,
      pagination: observable,
      sortState: observable,
    };
  }

  protected static getMobxBaseAnnotations<T extends TBaseItem, Filters>() {
    return Object.keys(this.getMobxAnnotations()).reduce(
      (acc, cur) => {
        acc[cur] = override;
        return acc;
      },
      {} as TMobXAnnotationsMap<T, Filters>
    );
  }

  protected abstract apiEndPoints: IApiEndPoints<T, Filters>;
}
