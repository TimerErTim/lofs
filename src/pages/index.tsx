import { useState, useEffect } from 'react';
import Head from 'next/head';
import { logout } from '@/utils/auth';
import useNotesStore from '@/store/notesStore';
import CalendarView from '@/components/CalendarView';
import Layout from '@/components/Layout';

export default function Home() {
  // TODO: Fix calendar max-min dates (one day off in max direction)
  const { notes, isLoaded } = useNotesStore();

  const handleLogout = () => {
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
        <title>Lofs</title>
      </Head>

      <Layout headerButton={{
        label: 'Abmelden',
        onClick: handleLogout,
        variant: 'ghost'
      }}>
        <CalendarView notes={notes} />
      </Layout>
    </>
  );
}
