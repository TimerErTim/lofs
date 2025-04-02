export interface Note {
  id: string;
  date: string;
  text: string;
  imageUrl?: string;
}

export interface NotesData {
  notes: Note[];
} 