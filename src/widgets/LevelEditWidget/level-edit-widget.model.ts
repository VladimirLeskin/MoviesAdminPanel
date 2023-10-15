import {makeAutoObservable} from 'mobx';
import LevelsApi from 'src/api/Levels';
import {ELevelType, ILevelInfoDto} from 'src/api/dto/LevelDto';
import {IEditedLevelInfo} from './types';
import {toast} from 'react-toastify';
import {getAxiosErrorText} from '../../api/stdAxiosErrorHandler';

const emptyLevel: IEditedLevelInfo = {
  type: ELevelType.TIME,
  questions: [],
  previewImagePath: '',
  descriptions: [{lang: 'ru', title: '', description: ''}],
  totalTime: 200,
  isNewImage: false,
  isActive: false,
};

export class LevelEditWidgetModel {
  private _levelInfo: IEditedLevelInfo = emptyLevel;
  private _isLoading = false;

  public readonly defaultQuestion = {variants: [], image: {id: '', path: ''}};

  constructor() {
    makeAutoObservable(this, undefined, {autoBind: true});
  }

  public async loadLevel(levelId?: string) {
    if (levelId) {
      try {
        this.isLoading = true;
        const data = await LevelsApi.getLevelInfo(levelId);
        if (data.data) {
          const levelInfoDto = data.data;
          this.levelInfo = LevelEditWidgetModel.levelDtoToLevelInfo(levelInfoDto);
        }
      } catch (err) {
        toast.error(`Ошибка загрузки\n${getAxiosErrorText(err)}`);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.levelInfo = emptyLevel;
    }
  }

  public updateLevel(info: IEditedLevelInfo) {
    this.levelInfo = info;
  }

  public async save() {
    const levelInfo = this.levelInfo;
    this.isLoading = true;
    try {
      const response = await LevelsApi.createLevelInfo({
        id: levelInfo.id,
        descriptions: levelInfo.descriptions.reduce((acc, d) => {
          acc[d.lang] = d;
          return acc;
        }, {}),
        totalTime: levelInfo.totalTime,
        timeForEach: levelInfo.timeForEach,
        type: levelInfo.type,
        previewImage: levelInfo.previewImagePath,
        isNewImage: levelInfo.isNewImage,
        isActive: levelInfo.isActive,
        questions: levelInfo.questions
          .map(q => ({
            imageId: q.image.id,
            variants: q.variants.map(v => v.movie_id).filter(movieId => movieId),
          }))
          .filter(q => q.imageId),
      });

      if (response.data) {
        this.levelInfo = LevelEditWidgetModel.levelDtoToLevelInfo(response.data);
      }
    } catch (err: any) {
      toast.error(`Ошибка сохранения\n${getAxiosErrorText(err)}`);
    } finally {
      this.isLoading = false;
    }
  }

  get levelInfo(): IEditedLevelInfo {
    return this._levelInfo;
  }

  set levelInfo(value: IEditedLevelInfo) {
    this._levelInfo = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  private static levelDtoToLevelInfo(levelInfoDto: ILevelInfoDto): IEditedLevelInfo {
    return {
      type: levelInfoDto.type,
      id: levelInfoDto.id,
      previewImagePath: levelInfoDto.previewImageName,
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
}
