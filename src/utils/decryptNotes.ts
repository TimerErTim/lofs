import CryptoJS, { enc } from 'crypto-js';
import JSZip from 'jszip';
import { Note } from '@/types/notes';

/**
 * Decrypts and extracts notes from an encrypted zip file on the client side
 * @param encryptedBase64 - Base64 encoded encrypted data
 * @param password - Password to decrypt the data
 * @returns Promise with the parsed notes data
 */
export async function decryptNotes(
  encryptedBase64: string,
  password: string
): Promise<Note[] | null> {
  // Decrypt the data using the password
  let decryptedBase64;
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBase64, password);
    if (!decryptedBytes || decryptedBytes.sigBytes <= 0) {
      throw new Error("Decryption failed: Possibly incorrect password.");
    }

    decryptedBase64 = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedBase64) {
      throw new Error("Decryption resulted in an empty string.");
    }
  } catch (e: any) {
    console.error('Error decrypting data:', e);
    return null;
  }

  // Load the zip file
  const zip = new JSZip();
  let loadedZip;

  try {
    loadedZip = await zip.loadAsync(decryptedBase64, {
      base64: true
    });
  } catch (e) {
    console.error('Error loading zip:', e);
    return null;
  }

  // Extract the notes.json file
  const notesFile = loadedZip.file('notes.json');

  if (!notesFile) {
    console.error('Notes file not found in the encrypted archive');
    return null;
  }

  // Parse the notes data
  const notesContent = await notesFile.async('string');
  const notesData: { notes: Note[] } = JSON.parse(notesContent);

  // Process image paths
  for (const note of notesData.notes) {
    if (note.imageUrl) {
      // Check if the image exists in the zip
      const imageFile = loadedZip.file(`images/${note.imageUrl}`);
      if (imageFile) {
        const imageData = await imageFile.async('base64');
        // Create data URL for the image
        const extension = (note.imageUrl as string).split('.').pop()?.toLowerCase();
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

  // Sort notes by date (oldest first)
  notesData.notes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return notesData.notes;
}
