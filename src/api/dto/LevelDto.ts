import {QuestionDTO} from './QuestionDTO';

export enum ELevelType {
  // eslint-disable-next-line no-unused-vars
  COUNT = 'COUNT',
  // eslint-disable-next-line no-unused-vars
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
