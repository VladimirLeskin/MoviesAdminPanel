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
  type: 'TIME' | 'COUNT';
  timeForEach?: number;
  totalTime?: number;
  image: {
    id?: number;
    src?: string;
    content?: string;
  };
  isActive: boolean;
}
