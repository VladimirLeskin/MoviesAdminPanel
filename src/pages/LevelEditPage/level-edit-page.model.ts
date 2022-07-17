import {makeAutoObservable} from 'mobx';
import LevelsApi from 'src/api/Levels';
import {ELevelType, ILevelDto} from 'src/api/dto/LevelDto';
import {IEditedLevelInfo} from './types';

const emptyLevel: IEditedLevelInfo = {
  type: ELevelType.TIME,
  questions: [],
  previewImagePath: '',
  title: '',
  description: '',
  totalTime: 200,
  isNewImage: false,
};

export class LevelEditPageModel {
  private _levelInfo: IEditedLevelInfo = emptyLevel;
  private _isLoading = false;

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
          this.levelInfo = LevelEditPageModel.levelDtoToLevelInfo(levelInfoDto);
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  public updateLevel(info: IEditedLevelInfo) {
    this.levelInfo = info;
  }

  public addQuestion() {
    this.levelInfo.questions.push({variants: [], image: {id: '', path: ''}});
  }

  public async save() {
    const levelInfo = this.levelInfo;
    this.isLoading = true;
    try {
      const response = await LevelsApi.createLevelInfo({
        id: levelInfo.id,
        title: levelInfo.title,
        description: levelInfo.description,
        totalTime: levelInfo.totalTime,
        timeForEach: levelInfo.timeForEach,
        type: levelInfo.type,
        previewImage: levelInfo.previewImagePath,
        isNewImage: levelInfo.isNewImage,
        questions: levelInfo.questions.map(q => ({
          imageId: q.image.id,
          variants: q.variants.map(v => v.movie_id),
        })),
      });

      if (response.data) {
        this.levelInfo = LevelEditPageModel.levelDtoToLevelInfo(response.data);
      }
    } catch (err: any) {
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

  private static levelDtoToLevelInfo(levelInfoDto: ILevelDto): IEditedLevelInfo {
    return {
      type: levelInfoDto.type,
      id: levelInfoDto.id,
      previewImagePath: levelInfoDto.previewImageName,
      title: levelInfoDto.title,
      description: levelInfoDto.description,
      totalTime: levelInfoDto.totalTime,
      timeForEach: levelInfoDto.timeForEach,
      isNewImage: false,
      questions: levelInfoDto.questions.map(q => ({
        id: q.id,
        image: {id: q.image_id, path: q.imagePath},
        variants: q.variants.filter(v => v.movie_id !== q.correctId),
      })).sort((a, b) => +a.id - +b.id),
    };
  }
}
