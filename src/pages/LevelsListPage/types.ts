export type ELevelType = 'COUNT' | 'TIME';

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
