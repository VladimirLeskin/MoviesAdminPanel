import {makeAutoObservable, runInAction} from 'mobx';
import {ICountryListItemDto} from '../api/dto/ICountryDto';
import CountriesApi from '../api/Countries';
import {toast} from 'react-toastify';
import {getAxiosErrorText} from '../api/stdAxiosErrorHandler';

class CountriesModel {
  private _countries?: ICountryListItemDto[] = undefined;
  private _isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public invalidate() {
    this.loadCountries();
  }

  public get countries() {
    if (!this._countries && !this._isLoading) {
      this.loadCountries();
      return {};
    } else {
      return (
        this._countries?.reduce<Record<string, ICountryListItemDto>>((acc, cur) => {
          acc[cur.country_code] = cur;
          return acc;
        }, {}) ?? {}
      );
    }
  }

  private loadCountries() {
    this._isLoading = true;
    CountriesApi.getCountries()
      .then(resp => {
        this._countries = resp.data.items;
      })
      .catch(e => toast.error(`Ошибка загрузки стран\n${getAxiosErrorText(e)}`))
      .finally(() => {
        runInAction(() => {
          this._isLoading = false;
        });
      });
  }
}

export const COUNTRIES = new CountriesModel();
