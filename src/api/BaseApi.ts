import Config from '../entries/Config';
import axios, {AxiosResponse} from 'axios';
import {getAxiosErrorText} from './stdAxiosErrorHandler';
import {toast} from 'react-toastify';

type ArgumentsOf<T extends Function> = T extends (...args: infer R) => any ? R : never;

export class BaseApi {
  protected static url(path: string) {
    return Config.apiUrl + path;
  }

  protected static transport = {
    get<T = any, R = AxiosResponse<T>, D = any>(...args: ArgumentsOf<typeof axios.get<T, R, D>>) {
      return axios.get<T, R, D>(...args).catch(BaseApi.processError);
    },
    delete<T = any, R = AxiosResponse<T>, D = any>(...args: ArgumentsOf<typeof axios.delete<T, R, D>>) {
      return axios.delete<T, R, D>(...args).catch(BaseApi.processError);
    },
    head<T = any, R = AxiosResponse<T>, D = any>(...args: ArgumentsOf<typeof axios.head<T, R, D>>) {
      return axios.head<T, R, D>(...args).catch(BaseApi.processError);
    },
    options<T = any, R = AxiosResponse<T>, D = any>(...args: ArgumentsOf<typeof axios.options<T, R, D>>) {
      return axios.options<T, R, D>(...args).catch(BaseApi.processError);
    },
    post<T = any, R = AxiosResponse<T>, D = any>(...args: ArgumentsOf<typeof axios.post<T, R, D>>) {
      return axios.post<T, R, D>(...args).catch(BaseApi.processError);
    },
    put<T = any, R = AxiosResponse<T>, D = any>(...args: ArgumentsOf<typeof axios.put<T, R, D>>) {
      return axios.put<T, R, D>(...args).catch(BaseApi.processError);
    },
    patch<T = any, R = AxiosResponse<T>, D = any>(...args: ArgumentsOf<typeof axios.patch<T, R, D>>) {
      return axios.patch<T, R, D>(...args).catch(BaseApi.processError);
    },
  };

  private static processError(err: unknown): never {
    toast.error(getAxiosErrorText(err, true));
    throw err;
  }
}
