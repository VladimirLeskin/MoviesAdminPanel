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
      const failureDetails = data.failures?.length
        ? `\n${data.failures
            .map(
              f =>
                `${f.type} ${f.tmdb_id}: ${f.reason}` +
                `${f.imdb_id ? ` (${f.imdb_id})` : ''}${f.message ? ` — ${f.message}` : ''}`
            )
            .join('\n')}`
        : '';
      toast.info(`Создано: ${data.created}
        Обновлено: ${data.updated}
        Ошибка создания: ${data.failToCreate}
        Ошибка обновления: ${data.failToUpdate}${failureDetails}
      `);
      return true;
    } catch {
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}
