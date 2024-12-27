import {makeAutoObservable} from 'mobx';
import {toast} from 'react-toastify';

import {MoviesApi} from 'src/api/MoviesApi';

export class MoviesImagesLoadButtonModel {
  public isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true, deep: false});
  }

  public async loadImages(ids: number[]) {
    this.isLoading = true;
    try {
      const {data: result} = await MoviesApi.generateMoviesImages(ids);
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
