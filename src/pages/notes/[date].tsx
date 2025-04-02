import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Button, Card, CardHeader, CardBody, CardFooter } from '@heroui/react';
import { format, parseISO, isValid } from 'date-fns';
import { loadEncryptedNotes } from '@/utils/loadNotes';
import { decryptNotes } from '@/utils/decryptNotes';
import { isAuthenticated, getStoredPassword } from '@/utils/auth';
import { Note } from '@/types/notes';

interface NotePageProps {
  encryptedData: string;
}

export default function NotePage({ encryptedData }: NotePageProps) {
  const router = useRouter();
  const { date } = router.query;
  
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  useEffect(() => {
    // Check authentication and decrypt notes
    const checkAuthAndLoadNotes = async () => {
      const isAuth = isAuthenticated();
      
      if (isAuth) {
        const storedPassword = getStoredPassword();
        if (storedPassword) {
          try {
            const decryptedData = await decryptNotes(encryptedData, storedPassword);
            if (decryptedData) {
              setNotes(decryptedData.notes);
              setAuthenticated(true);
              
              // Find the note by date
              if (date && typeof date === 'string') {
                const foundNoteIndex = decryptedData.notes.findIndex(note => {
                  const noteDate = format(new Date(note.date), 'yyyy-MM-dd');
                  return noteDate === date;
                });
                
                if (foundNoteIndex >= 0) {
                  setCurrentNote(decryptedData.notes[foundNoteIndex]);
                  setCurrentIndex(foundNoteIndex);
                } else {
                  // Note not found, redirect to homepage
                  router.push('/');
                }
              }
            } else {
              router.push('/');
            }
          } catch (error) {
            console.error('Error decrypting with stored password:', error);
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
      
      setLoading(false);
    };
    
    if (encryptedData) {
      checkAuthAndLoadNotes();
    }
  }, [encryptedData, date, router]);
  
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
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!authenticated || !currentNote) {
    router.push('/');
    return null;
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  return (
    <>
      <Head>
        <title>Note - {formatDate(currentNote.date)} | Daily Notes of Love</title>
        <meta name="description" content="Private daily notes of love" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Daily Notes of Love</h1>
            <Button variant="ghost" onClick={handleBackToCalendar}>Back to Calendar</Button>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="h-full">
              <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold">{formatDate(currentNote.date)}</h3>
              </CardHeader>
              <CardBody>
                {currentNote.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={currentNote.imageUrl} 
                      alt="Note image" 
                      className="w-full h-auto rounded-lg object-cover max-h-[400px]"
                    />
                  </div>
                )}
                <p className="whitespace-pre-line">{currentNote.text}</p>
              </CardBody>
              <CardFooter className="pt-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Note #{currentNote.id}</p>
              </CardFooter>
            </Card>
            
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
                    {currentIndex + 1} of {notes.length}
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
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // This function gets called at build time to determine which pages to pre-generate
  // We return an empty array for paths since the note dates are encrypted and not known at build time
  // Next.js will generate these pages on-demand
  return {
    paths: [],
    fallback: 'blocking', // Generate pages on-demand
  };
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Load encrypted notes without decryption
    const encryptedData = await loadEncryptedNotes();
    
    return {
      props: {
        encryptedData,
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        encryptedData: '',
      },
    };
  }
}; 