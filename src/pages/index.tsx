import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import LoginForm from '@/components/LoginForm';
import NotesList from '@/components/NotesList';
import { isAuthenticated } from '@/utils/auth';
import { loadNotes } from '@/utils/loadNotes';
import { Note } from '@/types/notes';

interface HomeProps {
  notes: Note[];
}

export default function Home({ notes }: HomeProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    setAuthenticated(isAuthenticated());
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Daily Notes of Love</title>
        <meta name="description" content="Private daily notes of love" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {authenticated ? (
        <NotesList notes={notes} onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Load and decrypt notes at build time
    const notesData = await loadNotes();
    
    return {
      props: {
        notes: notesData.notes,
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        notes: [],
      },
    };
  }
};
