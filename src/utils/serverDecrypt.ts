import { decryptNotes } from './decryptNotes';
import fs from 'fs';
import path from 'path';

/**
 * Decrypts and extracts notes data at build time using environment variable password
 * This function should ONLY be used during build time in getStaticPaths/getStaticProps
 * 
 * @returns Promise with the note dates or an empty array if decryption fails
 */
export async function decryptNotesAtBuildTime(): Promise<string[]> {
  try {
    // Get the decryption password from environment variable
    const password = process.env.NOTES_DECRYPTION_PASSWORD;
    
    if (!password) {
      console.warn('NOTES_DECRYPTION_PASSWORD environment variable not set - using fallback empty paths');
      return [];
    }
    
    const encryptedFilePath = path.join(process.cwd(), 'data', 'encrypted_notes.dat');
    
    if (!fs.existsSync(encryptedFilePath)) {
      console.warn(`Encrypted notes file not found at ${encryptedFilePath} - using fallback empty paths`);
      return [];
    }
    
    const encryptedData = fs.readFileSync(encryptedFilePath, 'utf8');
    console.log(`Read encrypted notes (length: ${encryptedData.length}) from ${encryptedFilePath}`);
    
    // Use the existing decryptNotes function
    try {
      const notes = await decryptNotes(encryptedData, password);
      
      if (!notes) {
        console.warn('Failed to decrypt notes data at build time - check password');
        return [];
      }
      
      console.log(`Successfully decrypted ${notes.length} notes`);
      
      // Extract just the dates for static path generation
      const noteDates = notes.map(note => {
        const date = new Date(note.date);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      });
      
      console.log(`Generated ${noteDates.length} static paths for notes`);
      return noteDates;
    } catch (decryptError) {
      console.error('Error in decryption process:', decryptError);
      return [];
    }
  } catch (error) {
    console.error('Error decrypting notes at build time:', error);
    return [];
  }
} 