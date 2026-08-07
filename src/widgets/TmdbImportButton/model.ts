import {makeAutoObservable} from 'mobx';
import {toast} from 'react-toastify';

import {TmdbImportItem} from '../../api/Api';
import {TmdbApi} from '../../api/TmdbApi';

export class TmdbImportButtonModel {
  public isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true, deep: false});
  }

  public async importItems(items: TmdbImportItem[]) {
    if (items.length === 0) {
      return false;
    }

    this.isLoading = true;
    try {
      const {data} = await TmdbApi.importItems({items});
      toast.info(`Создано: ${data.created}
        Обновлено: ${data.updated}
        Ошибка создания: ${data.failToCreate}
        Ошибка обновления: ${data.failToUpdate}
      `);
      return true;
    } catch {
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}
