import CryptoJS from 'crypto-js';
import JSZip from 'jszip';
import { Note, NotesData } from '@/types/notes';

/**
 * Decrypts and extracts notes from an encrypted zip file
 * @param encryptedBase64 - Base64 encoded encrypted data
 * @param password - Password to decrypt the data
 * @returns Promise with the parsed notes data
 */
export async function decryptNotes(
  encryptedBase64: string,
  password: string
): Promise<NotesData> {
  try {
    // Decrypt the data using the password
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBase64, password);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('Failed to decrypt data. Incorrect password?');
    }

    // Convert decrypted string to binary data for JSZip
    const binaryData = Buffer.from(decryptedData, 'base64');
    
    // Load the zip file
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(binaryData);
    
    // Extract the notes.json file
    const notesFile = loadedZip.file('notes.json');
    
    if (!notesFile) {
      throw new Error('Notes file not found in the encrypted archive');
    }
    
    // Parse the notes data
    const notesContent = await notesFile.async('string');
    const notesData: NotesData = JSON.parse(notesContent);
    
    // Process image paths
    for (const note of notesData.notes) {
      if (note.imageUrl) {
        // Check if the image exists in the zip
        const imageFile = loadedZip.file(`images/${note.imageUrl}`);
        if (imageFile) {
          const imageData = await imageFile.async('base64');
          // Create data URL for the image
          const extension = note.imageUrl.split('.').pop()?.toLowerCase();
          let mimeType = 'image/jpeg'; // Default
          
          if (extension === 'png') mimeType = 'image/png';
          if (extension === 'gif') mimeType = 'image/gif';
          if (extension === 'svg') mimeType = 'image/svg+xml';
          
          note.imageUrl = `data:${mimeType};base64,${imageData}`;
        } else {
          console.warn(`Image not found: ${note.imageUrl}`);
          note.imageUrl = undefined;
        }
      }
    }
    
    return notesData;
  } catch (error) {
    console.error('Error decrypting notes:', error);
    throw new Error('Failed to decrypt and load notes');
  }
} 