import {EntityEditorModel} from '../../models/EntityEditorModel';
import CountriesApi from '../../api/Countries';
import {ICountry} from './types';
import {makeObservable} from 'mobx';

export class CountryEditWidgetModel extends EntityEditorModel<ICountry> {
  constructor() {
    super();
    makeObservable(this, CountryEditWidgetModel.getMobxBaseAnnotations());
  }

  public override validate(data: ICountry) {
    const errors: string[] = [];
    if (!data.id) {
      errors.push('Код страны пустой');
    }
    return errors;
  }

  protected getDataRequestPromise(id?: ICountry['id']): Promise<ICountry> {
    if (id !== undefined) {
      return CountriesApi.getCountryInfo(id).then(({data}) => ({
        id: data.code,
        names: data.names,
      }));
    } else {
      return Promise.resolve({id: '', names: []});
    }
  }

  protected getDataSaveRequestPromise(data: ICountry): Promise<ICountry> {
    if (this.data?.id) {
      return CountriesApi.updateCountry(this.data.id, {
        code: data.id,
        names: data.names,
      }).then(({data}) => ({
        id: data.code,
        names: data.names,
      }));
    } else {
      return CountriesApi.createCountry({
        code: data.id,
        names: data.names,
      }).then(({data}) => ({
        id: data.code,
        names: data.names,
      }));
    }
  }
}
