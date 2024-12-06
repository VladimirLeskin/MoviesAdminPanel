import {makeObservable} from 'mobx';
import LevelsApi, {ISaveLevelRequest} from 'src/api/Levels';
import {ELevelType, ILevelInfoDto} from 'src/api/dto/LevelDto';
import {IEditedLevelInfo} from './types';
import {EntityEditorModel} from '../../models/EntityEditorModel';

const emptyLevel: IEditedLevelInfo = {
  type: ELevelType.TIME,
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

  protected async getDataRequestPromise(id: string | undefined): Promise<IEditedLevelInfo> {
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

  protected async getDataSaveRequestPromise(data: IEditedLevelInfo): Promise<IEditedLevelInfo> {
    const response = await LevelsApi.createLevelInfo(LevelEditWidgetModel.levelInfoToDto(data));

    if (response.data) {
      return LevelEditWidgetModel.levelDtoToLevelInfo(response.data);
    } else {
      throw new Error('response.data is empty');
    }
  }

  private static levelDtoToLevelInfo(levelInfoDto: ILevelInfoDto): IEditedLevelInfo {
    return {
      type: levelInfoDto.type,
      id: levelInfoDto.id,
      image: {src: levelInfoDto.previewImageName},
      descriptions: Object.entries(levelInfoDto.descriptions ?? {}).map(([lang, d]) => ({...d, lang})),
      totalTime: levelInfoDto.totalTime,
      timeForEach: levelInfoDto.timeForEach,
      isNewImage: false,
      isActive: levelInfoDto.active,
      questions: levelInfoDto.questions
        .map(q => ({
          id: q.id,
          image: {id: q.image_id, path: q.imagePath},
          variants: q.variants.filter(v => v.movie_id !== q.correctId),
          correctVariant: q.variants.find(v => v.movie_id === q.correctId),
        }))
        .sort((a, b) => +a.id - +b.id),
    };
  }

  private static levelInfoToDto(levelInfo: IEditedLevelInfo): ISaveLevelRequest {
    return {
      id: levelInfo.id,
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
          imageId: q.image.id,
          variants: q.variants.map(v => v.movie_id).filter(movieId => movieId),
        }))
        .filter(q => q.imageId),
    };
  }
}
