import fs from 'fs';
import path from 'path';

/**
 * Loads encrypted notes data file without decrypting
 * @returns Promise with encrypted notes data
 */
export async function loadEncryptedNotes(): Promise<string> {
  try {
    // Read encrypted notes file
    const encryptedFilePath = path.join(process.cwd(), 'data', 'encrypted_notes.dat');
    const encryptedData = fs.readFileSync(encryptedFilePath, 'utf8');
    
    return encryptedData;
  } catch (error) {
    console.error('Error loading encrypted notes:', error);
    throw new Error('Failed to load encrypted notes data');
  }
} 