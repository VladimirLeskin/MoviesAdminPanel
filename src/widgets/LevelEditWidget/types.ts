import {ELevelType} from '../../api/dto/LevelDto';

export interface IEditedLevelQuestionVariant {
  movie_id: number;
  title: string;
}

export interface IEditedLevelQuestion {
  image: {id: number; path: string};
  variants: IEditedLevelQuestionVariant[];
  correctVariant?: IEditedLevelQuestionVariant;
}

export interface IEditedLevelInfo {
  id?: number;
  descriptions: {lang: string; title: string; description: string}[];
  questions: IEditedLevelQuestion[];
  type: ELevelType;
  timeForEach?: number;
  totalTime?: number;
  image: {
    src?: string;
    content?: string;
  };
  isNewImage: boolean;
  isActive: boolean;
}
