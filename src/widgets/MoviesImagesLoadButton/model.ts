import {makeAutoObservable} from 'mobx';
import {toast} from 'react-toastify';

import {TypesafeMovies} from 'src/api/TypesafeMovies';

export class MoviesImagesLoadButtonModel {
  public isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true, deep: false});
  }

  public async loadImages(ids: number[]) {
    this.isLoading = true;
    try {
      const {data: result} = await TypesafeMovies.generateMoviesImages(ids);
      toast.info(
        Object.entries(result.movies)
          .map(([id, {status, imagesCount}]) => `${id}: ${imagesCount} ${status} `)
          .join('\n')
      );
      return true;
    } catch {
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}
