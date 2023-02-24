import Config from '../entries/Config';
import axios, {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {ICountryListItemDto} from './dto/ICountryDto';

export default class CountriesApi {
  private static get baseUrl(): string {
    return Config.apiUrl;
  }

  public static getCountries(): Promise<AxiosResponse<IPagedResponse<ICountryListItemDto>>> {
    return axios.get(`${CountriesApi.baseUrl}/countries/`);
  }
}
