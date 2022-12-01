import {action, AnnotationsMap, computed, makeObservable, observable, override} from 'mobx';

type TBaseItem = {id: unknown};

export interface IApiEndPoints<T extends TBaseItem> {
  load: () => Promise<T[]>;
  delete: (id: T['id']) => Promise<boolean | undefined>;
}

export abstract class ItemsListModel<T extends TBaseItem> {
  protected _items: T[] = [];

  constructor() {
    makeObservable(this, ItemsListModel.getMobxAnnotations(), {autoBind: true});
  }

  public loadItems() {
    this.apiEndPoints.load().then(this.setItems);
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
      this.loadItems();
      return true;
    } catch {
      return false;
    }
  }

  private static getMobxAnnotations<T extends TBaseItem>(): AnnotationsMap<ItemsListModel<T>, '_items'> {
    return {
      loadItems: action.bound,
      deleteItem: action.bound,
      setItems: action.bound,
      items: computed,
      _items: observable,
    };
  }

  protected static getMobxBaseAnnotations<T extends TBaseItem>() {
    return Object.keys(this.getMobxAnnotations()).reduce((acc, cur) => {
      acc[cur] = override;
      return acc;
    }, {} as AnnotationsMap<ItemsListModel<T>, '_items'>);
  }

  protected abstract apiEndPoints: IApiEndPoints<T>;
}
