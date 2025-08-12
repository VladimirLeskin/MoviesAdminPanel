export interface ICountryListItemDto {
  country_code: string;
  name: string;
}

export interface CountryInfoDto {
  code: string;
  names: Array<{lang: string; name: string}>;
}
