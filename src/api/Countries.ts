import {CountryInfoDto} from './dto/ICountryDto';
import {TypesafeBaseApi} from './TypesafeBaseApi';
import {ACCESS_TOKEN_STORAGE} from './oauth2/BaseOAuth2Client';

export default class CountriesApi extends TypesafeBaseApi {
  public static getCountries() {
    return this.transport.get('/movies-api/v2/countries', {});
  }

  public static createCountry(countryDto: CountryInfoDto) {
    return this.transport.post('/movies-api/v2/countries', {
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
      data: countryDto,
    });
  }

  public static updateCountry(code: string, countryDto: CountryInfoDto) {
    return this.transport.put('/movies-api/v2/countries/{code}', {
      headers: {Authorization: `Bearer ${ACCESS_TOKEN_STORAGE.getData()?.token}`},
      route: {code},
      data: countryDto,
    });
  }

  public static getCountryInfo(code: string) {
    return this.transport.get('/movies-api/v2/countries/{code}', {route: {code}});
  }
}
