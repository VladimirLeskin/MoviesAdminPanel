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
  active: boolean;
}

export interface ILevelListItemDto {
  id: string;
  active: boolean;
  description: string;
  previewImageName: string;
  questions_count: number;
  timeForEach?: number | null;
  title: string;
  totalTime?: number | null;
  type: ELevelType;
}

export interface ILevelInfoDto {
  id: string;
  descriptions?: Record<string, {title: string; description: string}>;
  questions: QuestionDTO[];
  type: ELevelType;
  timeForEach?: number;
  totalTime?: number;
  previewImageName?: string;
  active: boolean;
}
