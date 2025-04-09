import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Button, ButtonGroup, CardBody, Card, CardFooter } from '@heroui/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { decryptNotesAtBuildTime } from '@/utils/serverDecrypt';
import useNotesStore from '@/store/notesStore';
import { Note } from '@/types/notes';
import Layout from '@/components/Layout';

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePrevious, handleNext]); // Add dependencies to ensure the latest functions are used

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
        <title>{formatDate(currentNote.date)} | Lofs</title>
      </Head>

      <Layout
        headerButton={{
          label: 'Zum Kalender',
          onClick: handleBackToCalendar,
          variant: 'ghost'
        }}
        backgroundImage={currentNote.imageUrl}
      >
        <div className="m-6 lg:m-12 flex flex-col items-center justify-between flex-grow w-full max-w-sm md:max-w-none gap-6 md:items-center md:flex-row">
          {/* Content */}
          <Card isBlurred fullWidth>
            <CardBody>
              <h2 className="text-2xl font-bold mb-4 lg:mb-6 text-center text-gray-800 dark:text-gray-100">
                {formatDate(currentNote.date)}
              </h2>

              <div className="">
                <p className="whitespace-pre-line text-lg text-gray-800 dark:text-gray-100">{currentNote.text}</p>
              </div>

              <div className="mt-1 text-right text-xs text-gray-600 dark:text-gray-400">
                {notes.length > 1 && (
                  <span>
                    {currentIndex + 1} von {notes.length}
                  </span>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="w-full flex flex-row items-center justify-between md:contents">
            <Button
              onPress={handlePrevious}
              isDisabled={notes.length <= 1}
              aria-label="Vorherige Notiz"
              variant="faded"
              color="danger"
              className="rounded-full md:order-first"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              onPress={handleNext}
              isDisabled={notes.length <= 1}
              aria-label="Nächste Notiz"
              variant="faded"
              color="danger"
              className="rounded-full md:order-last"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </Layout>
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