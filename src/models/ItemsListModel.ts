import {action, AnnotationsMap, computed, makeObservable, observable, override, runInAction} from 'mobx';
import {AxiosResponse} from 'axios';
import {IPagedResponse} from '../api/types';

type TBaseItem = {id: unknown};
type TMobXAnnotationsMap<T extends TBaseItem, Filters> = AnnotationsMap<ItemsListModel<T, Filters>, '_items'>;

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
}

export abstract class ItemsListModel<T extends TBaseItem, Filters> {
  protected _items: T[] = [];
  protected lastLoadPayload: IRequestPayload<Filters> | undefined = undefined;

  public filter: Filters | undefined = undefined;
  public pagination: IListPagination = {pageSize: 20};
  public total: number = 0;
  public isLoading = false;

  private lastRequestId?: Symbol;

  constructor() {
    makeObservable(this, ItemsListModel.getMobxAnnotations(), {autoBind: true});
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
      loadItems: action.bound,
      deleteItem: action.bound,
      setItems: action.bound,
      items: computed,
      _items: observable,
      total: observable,
      filter: observable,
      pagination: observable,
    };
  }

  protected static getMobxBaseAnnotations<T extends TBaseItem, Filters>() {
    return Object.keys(this.getMobxAnnotations()).reduce((acc, cur) => {
      acc[cur] = override;
      return acc;
    }, {} as TMobXAnnotationsMap<T, Filters>);
  }

  protected abstract apiEndPoints: IApiEndPoints<T, Filters>;
}
