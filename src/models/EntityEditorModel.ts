import {action, AnnotationsMap, computed, makeObservable, observable, override} from 'mobx';
import {toast} from 'react-toastify';
import {TBaseEntity} from '../entries/BaseEntity';
import {getAxiosErrorText} from '../api/stdAxiosErrorHandler';

export abstract class EntityEditorModel<T extends TBaseEntity> {
  private _isLoading = false;
  private _isSaving = false;
  private _data?: T = undefined;
  private _editedData?: T = undefined;
  private _revision: number = Date.now();

  constructor() {
    makeObservable(this, EntityEditorModel.getMobxAnnotations(), {autoBind: true, deep: false});
  }

  public async load(id: T['id']) {
    this.isLoading = true;
    try {
      this.data = await this.getDataRequestPromise(id);
      this.revision = Date.now();
    } catch (e) {
      toast.error(`Ошибка загрузки\n${getAxiosErrorText(e)}`);
      this.data = undefined;
    }
    this.isLoading = false;
  }

  public async save(_data?: T) {
    const data = _data || this._editedData;

    if (!data) {
      return;
    }

    const validationErrors = this.validate(data);
    if (validationErrors.length) {
      toast.error(validationErrors.join(', '));
      return;
    }

    const toastId = toast.loading('Сохраняем');
    const toastOptions = {isLoading: false, autoClose: 10000, closeButton: true};
    try {
      this._isSaving = true;
      const newData = await this.getDataSaveRequestPromise(data);
      toast.update(toastId, {type: 'success', render: 'Сохранено', ...toastOptions});
      this.data = newData;
      this.revision = Date.now();
      return this.data;
    } catch (e) {
      toast.update(toastId, {
        type: 'error',
        render: `Ошибка сохранения\n${getAxiosErrorText(e)}`,
        ...toastOptions,
      });
      throw e;
    } finally {
      this._isSaving = false;
    }
  }

  public editData(data: T) {
    window.addEventListener('beforeunload', EntityEditorModel.confirmExit);
    this._editedData = data;
  }

  protected validate(_data: T): string[] {
    return [];
  }

  protected abstract getDataRequestPromise(id: T['id']): Promise<T>;

  protected abstract getDataSaveRequestPromise(data: T): Promise<T>;

  private static confirmExit(event: BeforeUnloadEvent) {
    if (!confirm('Есть несохранённые данные. Точно выйти?')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // setters/getters
  public get data(): T | undefined {
    return this._data;
  }

  public set data(value: T | undefined) {
    this._data = value;
    this._editedData = value;
  }

  public get isLoading(): boolean {
    return this._isLoading || this._isSaving;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
  }

  public get revision(): number {
    return this._revision;
  }

  public set revision(value: number) {
    window.removeEventListener('beforeunload', EntityEditorModel.confirmExit);
    this._revision = value;
  }

  // mobx stuff
  private static getMobxAnnotations<T extends TBaseEntity>(): AnnotationsMap<
    EntityEditorModel<T>,
    '_isLoading' | '_isSaving' | '_data' | '_editedData' | 'validate'
  > {
    return {
      _data: observable,
      _editedData: observable,
      _isLoading: observable,
      _isSaving: observable,
      data: computed,
      isLoading: computed,
      load: action.bound,
      validate: action.bound,
      editData: action.bound,
      save: action.bound,
    };
  }

  protected static getMobxBaseAnnotations<T extends TBaseEntity>() {
    return Object.keys(this.getMobxAnnotations()).reduce((acc, key) => {
      acc[key] = override;
      return acc;
    }, {}) as ReturnType<typeof this.getMobxAnnotations<T>>;
  }
}
