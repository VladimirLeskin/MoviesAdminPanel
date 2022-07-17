export interface QuestionDTO {
  id: string;
  image_id: string;
  imagePath: string;
  correctId: string;
  variants: QuestionVariantDTO[];
}

export interface QuestionVariantDTO {
  movie_id: string;
  original_title: string;
  title: string;
  date: string;
}
