export type IconName =
  | "plus"
  | "minus"
  | "spinner"
  | "close"
  | "file-upload"
  | "file-download"
  | "download";

export interface Article {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  readingProgress?: number;
}
