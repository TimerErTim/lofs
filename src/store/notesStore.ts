import { create } from 'zustand';
import { Note } from '@/types/notes';
import { decryptNotes } from '@/utils/decryptNotes';

interface NotesState {
  // Data
  notes: Note[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  storeEncryptedNotes: (encryptedData: string, password: string) => Promise<boolean>;
  resetNotes: () => void;
}

const useNotesStore = create<NotesState>((set, get) => ({
  // Initial state
  notes: [],
  isLoaded: false,
  isLoading: false,
  error: null,
  
  // Load and decrypt notes
  storeEncryptedNotes: async (encryptedData: string, password: string) => {
    // Don't reload if already loaded and no error
    if (get().isLoaded && !get().error) {
      return true;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const decryptedData = await decryptNotes(encryptedData, password);
      
      if (!decryptedData) {
        set({ 
          error: 'Decryption failed: Invalid password or corrupted data',
          isLoading: false
        });
        return false;
      }
      
      set({ 
        notes: decryptedData,
        isLoaded: true,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      console.error('Failed to decrypt notes:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error during decryption',
        isLoading: false
      });
      return false;
    }
  },
  
  // Reset the store (used for logout)
  resetNotes: () => {
    set({
      notes: [],
      isLoaded: false,
      isLoading: false,
      error: null
    });
  }
}));

export default useNotesStore; 