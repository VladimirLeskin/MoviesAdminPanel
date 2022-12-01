import {IApiEndPoints, ItemsListModel} from '../../models/ItemsListModel';
import {ILevelDto} from '../../api/dto/LevelDto';
import LevelsApi from '../../api/Levels';

export class LevelsListModel extends ItemsListModel<ILevelDto> {
  protected apiEndPoints: IApiEndPoints<ILevelDto> = {
    load: () => LevelsApi.getLevels().then((resp) => resp.data.items),
    delete: () => Promise.reject(new Error('not implemented')),
  };
}
