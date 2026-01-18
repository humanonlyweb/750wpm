export type IconName =
  | "plus"
  | "minus"
  | "spinner"
  | "close"
  | "file-upload"
  | "file-download"
  | "download"
  | "sun"
  | "moon";

export interface Article {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  readingProgress?: number;
}

export type ReadingMode = "rsvp" | "bionic";

export interface BionicWord {
  bold: string;
  normal: string;
}

export interface BionicSegment {
  type: "word" | "space";
  bold?: string;
  normal?: string;
  value?: string;
}
