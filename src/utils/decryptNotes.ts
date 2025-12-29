import CryptoJS from 'crypto-js';
import { Note } from '@/types/notes';

type NotesPayload = {
  notes?: Note[];
};

/**
 * Decrypts the notes JSON payload and returns the parsed note array.
 */
export async function decryptNotes(
  encryptedBase64: string,
  password: string
): Promise<Note[] | null> {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedBase64, password);
    if (!decryptedBytes || decryptedBytes.sigBytes <= 0) {
      throw new Error('Decryption failed: possibly incorrect password.');
    }

    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error('Decryption resulted in an empty payload.');
    }

    const parsed: NotesPayload = JSON.parse(decryptedText);
    const notes = Array.isArray(parsed.notes) ? parsed.notes : [];

    notes.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return (aTime || 0) - (bTime || 0);
    });

    return notes;
  } catch (error) {
    console.error('Error decrypting notes:', error);
    return null;
  }
}

/**
 * Decrypts the base64 ciphertext for an image into a plain base64 payload.
 */
export async function decryptImageAsset(
  encryptedBase64: string,
  password: string
): Promise<string | null> {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, password);
    if (!decrypted || decrypted.sigBytes <= 0) {
      throw new Error('Image decryption failed: invalid ciphertext.');
    }

    const base64 = decrypted.toString(CryptoJS.enc.Base64);
    if (!base64) {
      throw new Error('Image decryption resulted in empty data.');
    }

    return base64;
  } catch (error) {
    console.error('Error decrypting image asset:', error);
    return null;
  }
}

function encodeImagePath(imagePath: string): string {
  return imagePath
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

/**
 * Fetches the encrypted image payload for a given imageUrl.
 */
export async function fetchEncryptedImageAsset(imageUrl: string): Promise<string | null> {
  try {
    const encodedPath = encodeImagePath(imageUrl);
    const response = await fetch(`/notes-images/${encodedPath}.dat`);
    if (!response.ok) {
      console.warn(`Image asset not found: ${imageUrl} (${response.status})`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching encrypted image asset:', error);
    return null;
  }
}
