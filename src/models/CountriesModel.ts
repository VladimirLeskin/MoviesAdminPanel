import {makeAutoObservable, runInAction} from 'mobx';
import {ICountryListItemDto} from '../api/dto/ICountryDto';
import CountriesApi from '../api/Countries';

export class CountriesModel {
  private _countries?: ICountryListItemDto[] = undefined;
  private _isLoading = false;

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public get countries(): Record<string, ICountryListItemDto> {
    if (!this._countries && !this._isLoading) {
      this._isLoading = true;
      CountriesApi.getCountries()
        .then(resp => {
          this._countries = resp.data.items;
        })
        .catch(() => {})
        .finally(() => {
          runInAction(() => {
            this._isLoading = false;
          });
        });
      return {};
    } else {
      return (
        this._countries?.reduce((acc, cur) => {
          acc[cur.country_code] = cur;
          return acc;
        }, {}) ?? {}
      );
    }
  }
}

export const COUNTRIES = new CountriesModel();
