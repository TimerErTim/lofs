import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import CalendarView from '@/components/CalendarView';
import { getStoredPassword, logout } from '@/utils/auth';
import { loadEncryptedNotes } from '@/utils/loadNotes';
import { decryptNotes } from '@/utils/decryptNotes';
import { Note } from '@/types/notes';

interface HomeProps {
  encryptedData: string;
}

export default function Home({ encryptedData }: HomeProps) {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Decrypt notes with stored password - AuthGuard ensures we have a password
    const loadNotes = async () => {
      const storedPassword = getStoredPassword();
      
      if (storedPassword) {
        try {
          const decryptedData = await decryptNotes(encryptedData, storedPassword);
          if (decryptedData) {
            setNotes(decryptedData.notes);
          }
        } catch (error) {
          console.error('Error decrypting with stored password:', error);
        }
      }
      
      setLoading(false);
    };
    
    loadNotes();
  }, [encryptedData]);

  const handleLogout = () => {
    logout();
    // The page will be reloaded/redirected by AuthGuard
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p>Wird geladen...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tägliche Liebesnotizen</title>
        <meta name="description" content="Private Liebesnotizen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CalendarView notes={notes} onLogout={handleLogout} />
    </>
  );
}

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
