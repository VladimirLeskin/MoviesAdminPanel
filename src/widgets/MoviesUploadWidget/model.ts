import {makeAutoObservable} from 'mobx';
import {toast} from 'react-toastify';
import {MoviesApi} from '../../api/MoviesApi';

export class MoviesUploadModel {
  public isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true, deep: false});
  }

  public async uploadMoviesFile(file: File) {
    this.isLoading = true;
    try {
      const {data: total} = await MoviesApi.createFromFile(file);
      toast.success(`Создано успешно: ${total}`);
    } catch {
    } finally {
      this.isLoading = false;
    }
  }
}
