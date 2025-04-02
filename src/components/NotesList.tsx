import { useState } from 'react';
import { Button } from '@heroui/react';
import NoteCard from './NoteCard';
import { Note } from '@/types/notes';
import { logout } from '@/utils/auth';

interface NotesListProps {
  notes: Note[];
  onLogout: () => void;
}

export default function NotesList({ notes, onLogout }: NotesListProps) {
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  
  const handleNext = () => {
    setActiveNoteIndex((prev) => (prev + 1) % notes.length);
  };
  
  const handlePrevious = () => {
    setActiveNoteIndex((prev) => (prev - 1 + notes.length) % notes.length);
  };
  
  const handleLogout = () => {
    logout();
    onLogout();
  };
  
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">No Notes Found</h2>
          <p className="mb-8">There are no love notes available at the moment.</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Daily Notes of Love</h1>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {notes[activeNoteIndex] && (
            <NoteCard note={notes[activeNoteIndex]} />
          )}
          
          <div className="flex justify-between mt-8">
            <Button 
              onClick={handlePrevious}
              disabled={notes.length <= 1}
            >
              Previous
            </Button>
            <div className="text-center">
              {notes.length > 1 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {activeNoteIndex + 1} of {notes.length}
                </span>
              )}
            </div>
            <Button 
              onClick={handleNext}
              disabled={notes.length <= 1}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 py-4 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            With love, every day.
          </p>
        </div>
      </footer>
    </div>
  );
} 