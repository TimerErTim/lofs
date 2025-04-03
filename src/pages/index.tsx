import { useState, useEffect } from 'react';
import Head from 'next/head';
import { logout } from '@/utils/auth';
import useNotesStore from '@/store/notesStore';
import CalendarView from '@/components/CalendarView';

export default function Home() {
  const { notes, isLoaded, resetNotes } = useNotesStore();

  const handleLogout = () => {
    resetNotes();
    logout();
    // The page will be reloaded/redirected by AuthGuard
  };

  if (!isLoaded) {
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
