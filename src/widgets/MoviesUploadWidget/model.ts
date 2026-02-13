import {makeAutoObservable} from 'mobx';
import {toast} from 'react-toastify';
import {MoviesApi} from '../../api/MoviesApi';

export class MoviesUploadModel {
  public isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true, deep: false});
  }

  public async uploadMoviesFile(file: File, override: boolean) {
    this.isLoading = true;
    try {
      const {data} = await MoviesApi.createFromFile(file, override);
      toast.info(`Создано: ${data.created}
        Обновлено: ${data.updated}
        Ошибка создания: ${data.failToCreate}
        Ошибка обновления: ${data.failToUpdate}
      `);
    } catch {
    } finally {
      this.isLoading = false;
    }
  }
}
