import fs from 'fs';
import path from 'path';
import { decryptNotes } from './decryptNotes';
import { Note, NotesData } from '@/types/notes';

/**
 * Loads encrypted notes at build time
 * @returns Promise with notes data
 */
export async function loadNotes(): Promise<NotesData> {
  try {
    // Get notes decryption password from environment variable
    const password = process.env.NOTES_DECRYPTION_PASSWORD;
    
    if (!password) {
      throw new Error('NOTES_DECRYPTION_PASSWORD environment variable is not set');
    }
    
    // Read encrypted notes file
    const encryptedFilePath = path.join(process.cwd(), 'data', 'encrypted_notes.dat');
    const encryptedData = fs.readFileSync(encryptedFilePath, 'utf8');
    
    // Decrypt the notes
    const notesData = await decryptNotes(encryptedData, password);
    
    // Sort notes by date (newest first)
    notesData.notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return notesData;
  } catch (error) {
    console.error('Error loading notes:', error);
    // Return empty notes array as fallback
    return { notes: [] };
  }
} 