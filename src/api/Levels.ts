import Config from '../entries/Config';
import axios, {AxiosResponse} from 'axios';
import {ELevelType, ILevelDto, ILevelInfoDto} from './dto/LevelDto';
import {IPagedResponse} from './types';

interface ILevelQuestionRequestion {
  imageId: string;
  variants: string[];
}

interface ISaveLevelRequest {
  id?: string;
  descriptions?: Record<string, {title: string; description: string}>;
  questions: ILevelQuestionRequestion[];
  type: ELevelType;
  timeForEach?: number;
  totalTime?: number;
  previewImage?: string;
  isNewImage: boolean;
}

export default class LevelsApi {
  private static get baseUrl(): string {
    return Config.apiUrl;
  }

  public static getLevels(): Promise<AxiosResponse<IPagedResponse<ILevelDto>>> {
    return axios.get(LevelsApi.baseUrl + '/levels');
  }

  public static getLevelInfo(levelId: string): Promise<AxiosResponse<ILevelInfoDto>> {
    return axios.get(`${LevelsApi.baseUrl}/levels/view?id=${levelId}`);
  }

  public static createLevelInfo(levelInfo: ISaveLevelRequest): Promise<AxiosResponse<ILevelInfoDto>> {
    return axios.post(`${LevelsApi.baseUrl}/levels/create`, levelInfo);
  }
}
