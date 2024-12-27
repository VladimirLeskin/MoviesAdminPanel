import {IApiEndPoints, ItemsListModel} from '../../models/ItemsListModel';
import {makeObservable} from 'mobx';
import {LevelsApi} from '../../api/Levels';
import {ILevelListItemDto} from './types';

type TLevelsFilter = undefined;

export class LevelsListModel extends ItemsListModel<ILevelListItemDto, TLevelsFilter> {
  protected apiEndPoints: IApiEndPoints<ILevelListItemDto, TLevelsFilter> = {
    load: v =>
      LevelsApi.getLevels({page: 0, pageSize: 50, ...v?.pagination}).then(response => ({
        ...response,
        data: {
          total: response.data.total,
          items: response.data.items.map(it => {
            const title = it.titles.find(({lang}) => lang === 'ru');

            return {
              id: it.id,
              active: it.active,
              description: title?.description ?? '',
              title: title?.title ?? '',
              previewImageName: it.previewImageName ?? '',
              questions_count: it.questions_count,
              timeForEach: it.timeForEach,
              totalTime: it.totalTime,
              type: it.type,
            };
          }),
        },
      })),
    delete: () => Promise.reject(new Error('not implemented')),
  };

  constructor() {
    super();
    makeObservable(this, LevelsListModel.getMobxBaseAnnotations());
  }

  public onPublish(id: number, publish: boolean) {
    LevelsApi.publishLevel(id, publish).then(() => {
      this.reload();
    });
  }
}
