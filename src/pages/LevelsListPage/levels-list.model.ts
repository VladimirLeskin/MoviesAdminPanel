import {IApiEndPoints, ItemsListModel} from '../../models/ItemsListModel';
import {ILevelListItemDto} from '../../api/dto/LevelDto';
import LevelsApi from '../../api/Levels';
import {makeObservable} from 'mobx';

type TLevelsFilter = undefined;

export class LevelsListModel extends ItemsListModel<ILevelListItemDto, TLevelsFilter> {
  protected apiEndPoints: IApiEndPoints<ILevelListItemDto, TLevelsFilter> = {
    load: v => LevelsApi.getLevels(v?.pagination),
    delete: () => Promise.reject(new Error('not implemented')),
  };

  constructor() {
    super();
    makeObservable(this, LevelsListModel.getMobxBaseAnnotations());
  }

  public onPublish(id: string, publish: boolean) {
    LevelsApi.publishLevel(id, publish).then(() => {
      this.reload();
    });
  }
}
