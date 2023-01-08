import {IApiEndPoints, ItemsListModel} from '../../models/ItemsListModel';
import {ILevelDto} from '../../api/dto/LevelDto';
import LevelsApi from '../../api/Levels';
import {makeObservable} from 'mobx';

type TLevelsFilter = undefined;

export class LevelsListModel extends ItemsListModel<ILevelDto, TLevelsFilter> {
  protected apiEndPoints: IApiEndPoints<ILevelDto, TLevelsFilter> = {
    load: () => LevelsApi.getLevels(),
    delete: () => Promise.reject(new Error('not implemented')),
  };

  constructor() {
    super();
    makeObservable(this, LevelsListModel.getMobxBaseAnnotations());
  }

  public onPublish(id: string, publish: boolean) {
    LevelsApi.publishLevel(id, publish).then(() => {
      this.loadItems();
    });
  }
}
