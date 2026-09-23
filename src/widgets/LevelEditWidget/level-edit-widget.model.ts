import {action, makeObservable, observable, runInAction} from 'mobx';
import {IEditedLevelInfo} from './types';
import {EntityEditorModel} from '../../models/EntityEditorModel';
import {LevelsApi} from '../../api/Levels';
import {LevelInfo, LevelInfoSaveRequest} from '../../api/Api';

const emptyLevel: IEditedLevelInfo = {
  type: 'TIME',
  questions: [],
  image: {},
  descriptions: [{lang: 'ru', title: '', description: ''}],
  totalTime: 200,
  isActive: false,
};

export class LevelEditWidgetModel extends EntityEditorModel<IEditedLevelInfo> {
  public isDeleting = false;

  constructor() {
    super();
    this.data = emptyLevel;
    makeObservable(this, {
      ...LevelEditWidgetModel.getMobxBaseAnnotations(),
      isDeleting: observable,
      deleteLevel: action.bound,
    });
  }

  protected async getDataRequestPromise(id: number | undefined): Promise<IEditedLevelInfo> {
    if (id) {
      const data = await LevelsApi.getLevelInfo(id);
      if (data.data) {
        return LevelEditWidgetModel.levelDtoToLevelInfo(data.data);
      }
    }
    return emptyLevel;
  }

  public override validate(data: IEditedLevelInfo): string[] {
    const errors: string[] = [];
    if (!data.questions.length) {
      errors.push('Список вопросов пуст');
    }

    if (!data.descriptions.length) {
      errors.push('Описание пусто');
    }

    for (const description of data.descriptions) {
      if (!description.title) {
        errors.push(`Отсутствует название для языка: ${description.lang}`);
      }
    }
    return errors;
  }

  public async deleteLevel() {
    const id = this.data?.id;
    if (!id || this.isDeleting || this.isLoading) {
      return false;
    }

    this.isDeleting = true;
    try {
      await LevelsApi.deleteLevel(id);
      return true;
    } finally {
      runInAction(() => {
        this.isDeleting = false;
      });
    }
  }

  protected async getDataSaveRequestPromise(data: IEditedLevelInfo): Promise<IEditedLevelInfo> {
    let response;
    if (data.id) {
      response = await LevelsApi.editLevelInfo(data.id, LevelEditWidgetModel.levelInfoToDto(data));
    } else {
      response = await LevelsApi.createLevelInfo(LevelEditWidgetModel.levelInfoToDto(data));
    }

    if (response.data) {
      return LevelEditWidgetModel.levelDtoToLevelInfo(response.data);
    } else {
      throw new Error('response.data is empty');
    }
  }

  private static levelDtoToLevelInfo(levelInfoDto: LevelInfo): IEditedLevelInfo {
    return {
      type: levelInfoDto.type,
      id: levelInfoDto.id,
      image: {src: levelInfoDto.image?.name, id: levelInfoDto.image?.id},
      descriptions: levelInfoDto.descriptions,
      totalTime: levelInfoDto.totalTime,
      timeForEach: levelInfoDto.timeForEach,
      isActive: levelInfoDto.active,
      questions: levelInfoDto.questions.map(q => {
        const variants = q.variants.map(v => ({
          movie_id: v.id,
          title: v.titles.find(t => t.lang === 'ru')?.title ?? '',
        }));

        return {
          image: {id: q.imageId, path: q.imagePath},
          variants: variants.filter(v => v.movie_id !== q.correctId),
          correctVariant: variants.find(v => v.movie_id === q.correctId),
        };
      }),
    };
  }

  private static levelInfoToDto(levelInfo: IEditedLevelInfo): LevelInfoSaveRequest {
    return {
      descriptions: levelInfo.descriptions,
      totalTime: levelInfo.totalTime,
      timeForEach: levelInfo.timeForEach,
      type: levelInfo.type,
      image: {
        id: levelInfo.image.id,
        content: levelInfo.image.content,
      },
      active: levelInfo.isActive,
      questions: levelInfo.questions
        .map(q => ({
          imageId: q.image.id,
          variants: q.variants.map(v => v.movie_id).filter(movieId => movieId),
        }))
        .filter(q => q.imageId),
    };
  }
}
