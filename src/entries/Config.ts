const trimTrailingSlash = (value: string | undefined): string => (value ?? '').replace(/\/$/, '');

const apiOrigin = trimTrailingSlash(process.env.API_ORIGIN);
const imagesOrigin = trimTrailingSlash(process.env.IMAGES_ORIGIN) || apiOrigin;

export default class Config {
  public static apiOrigin: string = apiOrigin;
  public static apiUrl: string = apiOrigin ? `${apiOrigin}/movies-api` : '/movies-api';
  public static imagesUrl: string = imagesOrigin ? `${imagesOrigin}/images` : '/images';
}
