import {AxiosResponse} from 'axios';
import {IPagedResponse} from './types';
import {CountryInfoDto, ICountryListItemDto} from './dto/ICountryDto';
import {BaseApi} from './BaseApi';

export default class CountriesApi extends BaseApi {
  public static getCountries(): Promise<AxiosResponse<IPagedResponse<ICountryListItemDto>>> {
    return this.transport.get(this.url('/countries/'));
  }

  public static createCountry(countryDto: CountryInfoDto): Promise<AxiosResponse<CountryInfoDto>> {
    return this.transport.post(this.url('/countries/create'), countryDto);
  }

  public static getCountryInfo(code: string): Promise<AxiosResponse<CountryInfoDto>> {
    return this.transport.get(this.url(`/countries/view?id=${code}`));
  }
}
