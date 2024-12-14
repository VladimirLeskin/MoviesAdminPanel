import {QuestionDTO} from './QuestionDTO';

export type ELevelType = 'COUNT' | 'TIME';

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
  id: number;
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
