import {ELevelType} from '../../api/dto/LevelDto';

export interface IEditedLevelQuestionVariant {
  movie_id: string;
  title: string;
}

export interface IEditedLevelQuestion {
  id?: string;
  image: {id: string; path: string};
  variants: IEditedLevelQuestionVariant[];
  correctVariant?: IEditedLevelQuestionVariant;
}

export interface IEditedLevelInfo {
  id?: string;
  descriptions: {lang: string; title: string; description: string}[];
  questions: IEditedLevelQuestion[];
  type: ELevelType;
  timeForEach?: number;
  totalTime?: number;
  previewImagePath?: string;
  isNewImage: boolean;
}
