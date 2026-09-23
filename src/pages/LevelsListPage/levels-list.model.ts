import {IApiEndPoints, ItemsListModel} from '../../models/ItemsListModel';
import {makeObservable, observable, runInAction} from 'mobx';
import {LevelsApi} from '../../api/Levels';
import {ILevelListItemDto} from './types';

type TLevelsFilter = undefined;

export class LevelsListModel extends ItemsListModel<ILevelListItemDto, TLevelsFilter> {
  public deletingIds: number[] = [];

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
    delete: id => LevelsApi.deleteLevel(id).then(() => true),
  };

  constructor() {
    super();
    makeObservable(this, {
      ...LevelsListModel.getMobxBaseAnnotations(),
      deletingIds: observable,
    });
  }

  public override async deleteItem(id: number) {
    if (this.deletingIds.includes(id)) {
      return false;
    }

    runInAction(() => {
      this.deletingIds = [...this.deletingIds, id];
    });
    try {
      return await super.deleteItem(id);
    } finally {
      runInAction(() => {
        this.deletingIds = this.deletingIds.filter(itemId => itemId !== id);
      });
    }
  }

  public onPublish(id: number, publish: boolean) {
    LevelsApi.publishLevel(id, publish).then(() => {
      this.reload();
    });
  }
}
