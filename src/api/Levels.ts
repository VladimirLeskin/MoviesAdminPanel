import axios, {AxiosResponse} from 'axios';
import {ELevelType, ILevelDto, ILevelInfoDto} from './dto/LevelDto';
import {IPagedResponse} from './types';
import {BaseApi} from './BaseApi';

interface ILevelQuestionRequestion {
  imageId: string;
  variants: string[];
}

interface IFindRequestParams {
  pageSize?: number;
  page?: number;
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
  isActive: boolean;
}

export default class LevelsApi extends BaseApi {
  public static getLevels(payload?: IFindRequestParams): Promise<AxiosResponse<IPagedResponse<ILevelDto>>> {
    const {page, pageSize} = payload ?? {};
    return axios.get(this.url('/levels'), {params: {page, pageSize}});
  }

  public static getLevelInfo(levelId: string): Promise<AxiosResponse<ILevelInfoDto>> {
    return axios.get(this.url(`/levels/view?id=${levelId}`));
  }

  public static createLevelInfo(levelInfo: ISaveLevelRequest): Promise<AxiosResponse<ILevelInfoDto>> {
    return axios.post(this.url('/levels/create'), levelInfo);
  }

  public static publishLevel(id: string, publish: boolean): Promise<AxiosResponse<void>> {
    return axios.post(this.url('/levels/publish'), {id, publish});
  }
}
