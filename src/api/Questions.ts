import Config from '../entries/Config';
import axios, {AxiosResponse} from 'axios';
import {QuestionDTO} from './dto/QuestionDTO';

export default class QuestionsApi {
  private static get baseUrl(): string {
    return Config.apiUrl;
  }

  public static getQuestions(): Promise<AxiosResponse<QuestionDTO[]>> {
    return axios.get(QuestionsApi.baseUrl + '/questions');
  }
}
