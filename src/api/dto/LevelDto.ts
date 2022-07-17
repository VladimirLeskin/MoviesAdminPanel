import {QuestionDTO} from './QuestionDTO';

export enum ELevelType {
  COUNT = 'COUNT',
  TIME = 'TIME',
}

export interface ILevelDto {
  id: string;
  title: string;
  description?: string;
  questions: QuestionDTO[];
  type: ELevelType;
  timeForEach?: number;
  totalTime?: number;
  previewImageName?: string;
}
