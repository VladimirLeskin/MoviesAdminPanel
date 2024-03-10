import axios, {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {ICountryListItemDto} from './dto/ICountryDto';
import {BaseApi} from './BaseApi';

export default class CountriesApi extends BaseApi {
  public static getCountries(): Promise<AxiosResponse<IPagedResponse<ICountryListItemDto>>> {
    return axios.get(this.url('/countries/'));
  }
}
