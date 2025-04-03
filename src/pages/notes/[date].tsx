import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@heroui/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { decryptNotesAtBuildTime } from '@/utils/serverDecrypt';
import useNotesStore from '@/store/notesStore';
import { Note } from '@/types/notes';

interface NotePageProps {
  date: string;
}

export default function NotePage({ date }: NotePageProps) {
  const router = useRouter();
  const { notes, isLoaded } = useNotesStore();
  
  const [loading, setLoading] = useState(true);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  useEffect(() => {
    // Notes are already loaded by AuthGuard in global state
    if (isLoaded && date && notes.length > 0) {
      // Find the note by date
      const foundNoteIndex = notes.findIndex(note => {
        const noteDate = format(new Date(note.date), 'yyyy-MM-dd');
        return noteDate === date;
      });
      
      if (foundNoteIndex >= 0) {
        setCurrentNote(notes[foundNoteIndex]);
        setCurrentIndex(foundNoteIndex);
      } else {
        // Note not found, redirect to homepage
        router.push('/');
      }
      
      setLoading(false);
    } else if (isLoaded && notes.length === 0) {
      // No notes available
      router.push('/');
      setLoading(false);
    }
  }, [date, isLoaded, notes, router]);
  
  const handleNext = () => {
    if (notes.length <= 1) return;
    
    const nextIndex = (currentIndex + 1) % notes.length;
    const nextNote = notes[nextIndex];
    const nextDate = format(new Date(nextNote.date), 'yyyy-MM-dd');
    
    router.push(`/notes/${nextDate}`);
  };
  
  const handlePrevious = () => {
    if (notes.length <= 1) return;
    
    const prevIndex = (currentIndex - 1 + notes.length) % notes.length;
    const prevNote = notes[prevIndex];
    const prevDate = format(new Date(prevNote.date), 'yyyy-MM-dd');
    
    router.push(`/notes/${prevDate}`);
  };
  
  const handleBackToCalendar = () => {
    router.push('/');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p>Wird geladen...</p>
      </div>
    );
  }
  
  if (!currentNote) {
    router.push('/');
    return null;
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <>
      <Head>
        <title>Notiz - {formatDate(currentNote.date)} | Lofs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow py-4 z-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Tägliche Liebesnotizen</h1>
            <Button variant="ghost" onPress={handleBackToCalendar} className="text-gray-700 dark:text-gray-300">Zurück zum Kalender</Button>
          </div>
        </header>
        
        <main className="flex-1 relative">
          {/* Background Image */}
          {currentNote.imageUrl && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-black/30 z-10" />
              <img 
                src={currentNote.imageUrl} 
                alt="Hintergrundbild" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Navigation Chevrons */}
          <Button 
            onPress={handlePrevious}
            isDisabled={notes.length <= 1}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg z-20 hover:bg-white dark:hover:bg-gray-700"
            aria-label="Vorherige Notiz"
            variant="ghost"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          
          <Button 
            onPress={handleNext}
            isDisabled={notes.length <= 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg z-20 hover:bg-white dark:hover:bg-gray-700"
            aria-label="Nächste Notiz"
            variant="ghost"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
          
          {/* Content */}
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className={`bg-white/90 dark:bg-gray-800/90 p-8 rounded-lg shadow-lg ${!currentNote.imageUrl ? 'mt-8' : ''}`}>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                  {formatDate(currentNote.date)}
                </h2>
                
                <div className="mt-6">
                  <p className="whitespace-pre-line text-lg text-gray-800 dark:text-gray-100">{currentNote.text}</p>
                </div>
                
                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                  {notes.length > 1 && (
                    <span>
                      Notiz {currentIndex + 1} von {notes.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-white dark:bg-gray-800 py-4 shadow-inner relative z-10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Mit Liebe, jeden Tag.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate all known paths at build time using the server-side decryption utility
  const noteDates = await decryptNotesAtBuildTime();
  
  if (noteDates.length === 0) {
    console.warn('No note dates could be generated at build time - check NOTES_DECRYPTION_PASSWORD');
    // Return empty paths - this will cause build warnings, but it's better than a build failure
    return {
      paths: [],
      fallback: false, // Return 404 for unknown paths
    };
  }
  
  // Create the paths array for all note dates
  const paths = noteDates.map(noteDate => ({
    params: { date: noteDate }
  }));
  
  return {
    paths,
    fallback: false, // Return 404 for any paths not generated at build time
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    // Extract the date parameter
    const date = params?.date as string;
    
    if (!date) {
      return { notFound: true };
    }
    
    return {
      props: {
        date,
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}; 