import {makeAutoObservable} from 'mobx';
import {toast} from 'react-toastify';
import {TypesafeMovies} from '../../api/TypesafeMovies';

export class MoviesUploadModel {
  public isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true, deep: false});
  }

  public async uploadMoviesFile(file: File) {
    this.isLoading = true;
    try {
      const {data: total} = await TypesafeMovies.createFromFile(file);
      toast.success(`Создано успешно: ${total}`);
    } catch {
    } finally {
      this.isLoading = false;
    }
  }
}
