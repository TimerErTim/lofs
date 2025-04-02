import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import LoginForm from '@/components/LoginForm';
import CalendarView from '@/components/CalendarView';
import { isAuthenticated, getStoredPassword } from '@/utils/auth';
import { loadEncryptedNotes } from '@/utils/loadNotes';
import { decryptNotes } from '@/utils/decryptNotes';
import { Note } from '@/types/notes';

interface HomeProps {
  encryptedData: string;
}

export default function Home({ encryptedData }: HomeProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const isAuth = isAuthenticated();
      
      if (isAuth) {
        // If authenticated, try to decrypt notes with stored password
        const storedPassword = getStoredPassword();
        if (storedPassword) {
          try {
            const decryptedData = await decryptNotes(encryptedData, storedPassword);
            if (decryptedData) {
              setNotes(decryptedData.notes);
              setAuthenticated(true);
            } else {
              // Decryption failed, clear authentication
              setAuthenticated(false);
            }
          } catch (error) {
            console.error('Error decrypting with stored password:', error);
            setAuthenticated(false);
          }
        } else {
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [encryptedData]);

  const handleLoginSuccess = async (password: string) => {
    try {
      const decryptedData = await decryptNotes(encryptedData, password);
      if (decryptedData) {
        setNotes(decryptedData.notes);
        setAuthenticated(true);
      }
    } catch (error) {
      console.error('Error in login decryption:', error);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setNotes([]);
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

      {authenticated ? (
        <CalendarView notes={notes} onLogout={handleLogout} />
      ) : (
        <LoginForm encryptedData={encryptedData} onLoginSuccess={handleLoginSuccess} />
      )}
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
