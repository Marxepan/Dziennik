
export interface ZIKData {
  trigger: string;
  thoughts: string;
  feelings: string;
  consequences: string;
}

export type Mood = 'wspaniale' | 'dobrze' | 'neutralnie' | 'źle' | 'okropnie';

export interface NoteData {
  text: string;
  isFall: boolean;
  fallTimestamp?: number;
  zik?: ZIKData;
  mood?: Mood;
  triggers?: string[];
}

export interface Notes {
  [date: string]: NoteData;
}