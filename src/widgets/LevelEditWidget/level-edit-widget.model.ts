import {makeObservable} from 'mobx';
import LevelsApi, {ISaveLevelRequest} from 'src/api/Levels';
import {IEditedLevelInfo} from './types';
import {EntityEditorModel} from '../../models/EntityEditorModel';
import {TypesafeLevelsApi} from '../../api/TypesafeLevels';
import {LevelInfo} from '../../api/Api';

const emptyLevel: IEditedLevelInfo = {
  type: 'TIME',
  questions: [],
  image: {},
  descriptions: [{lang: 'ru', title: '', description: ''}],
  totalTime: 200,
  isNewImage: false,
  isActive: false,
};

export class LevelEditWidgetModel extends EntityEditorModel<IEditedLevelInfo> {
  constructor() {
    super();
    this.data = emptyLevel;
    makeObservable(this, LevelEditWidgetModel.getMobxBaseAnnotations());
  }

  protected async getDataRequestPromise(id: number | undefined): Promise<IEditedLevelInfo> {
    if (id) {
      const data = await TypesafeLevelsApi.getLevelInfo(id);
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

  protected async getDataSaveRequestPromise(data: IEditedLevelInfo): Promise<IEditedLevelInfo> {
    const response = await LevelsApi.createLevelInfo(LevelEditWidgetModel.levelInfoToDto(data));

    if (response.data) {
      // TODO implement saving in v2 and transform response.data without requesting TypesafeLevelsApi.getLevelInfo
      const {data: levelInfo} = await TypesafeLevelsApi.getLevelInfo(+response.data.id);
      return LevelEditWidgetModel.levelDtoToLevelInfo(levelInfo);
    } else {
      throw new Error('response.data is empty');
    }
  }

  private static levelDtoToLevelInfo(levelInfoDto: LevelInfo): IEditedLevelInfo {
    return {
      type: levelInfoDto.type,
      id: levelInfoDto.id,
      image: {src: levelInfoDto.previewImageName},
      descriptions: levelInfoDto.descriptions,
      totalTime: levelInfoDto.totalTime,
      timeForEach: levelInfoDto.timeForEach,
      isNewImage: false,
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

  private static levelInfoToDto(levelInfo: IEditedLevelInfo): ISaveLevelRequest {
    return {
      id: levelInfo.id?.toString(),
      descriptions: levelInfo.descriptions.reduce<Exclude<ISaveLevelRequest['descriptions'], undefined>>((acc, d) => {
        acc[d.lang] = d;
        return acc;
      }, {}),
      totalTime: levelInfo.totalTime,
      timeForEach: levelInfo.timeForEach,
      type: levelInfo.type,
      previewImage: levelInfo.image.content ?? levelInfo.image.src,
      isNewImage: !!levelInfo.image.content,
      isActive: levelInfo.isActive,
      questions: levelInfo.questions
        .map(q => ({
          imageId: q.image.id.toString(),
          variants: q.variants
            .map(v => v.movie_id)
            .filter(movieId => movieId)
            .map(String),
        }))
        .filter(q => q.imageId),
    };
  }
}
