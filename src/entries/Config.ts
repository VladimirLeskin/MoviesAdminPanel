export default class Config {
  public static apiUrl: string = (process.env.API_HOST ?? '') + '/movies-api';
  public static imagesUrl: string = (process.env.IMAGES_HOST ?? '') + '/images';
}
