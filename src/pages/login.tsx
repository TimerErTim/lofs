import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Input } from '@heroui/react';
import { Button } from '@heroui/react';
import { isAuthenticated, storePassword } from '@/utils/auth';
import useNotesStore from '@/store/notesStore';
import { loadEncryptedNotesFromWindow } from '@/utils/loadNotesClient';

export default function LoginPage() {
  const router = useRouter();
  const { referrer } = router.query;

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCheckInProgress, setIsCheckInProgress] = useState(false);

  // Use the memoized hook to load encrypted data
  const encryptedData = loadEncryptedNotesFromWindow();

  // Access notes store
  const storeEncryptedNotes = useNotesStore(state => state.storeEncryptedNotes);

  // If user is already authenticated, redirect to homepage or referrer
  useEffect(() => {
    (async () => {
      if (await isAuthenticated()) {
        const destination = referrer && typeof referrer === 'string' ? referrer : '/';
        router.push(destination);
      }
    })();
  }, [router, referrer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!encryptedData) {
      setError('Encrypted data not yet loaded. Please wait.');
      return;
    }

    setIsCheckInProgress(true);
    setError('');

    try {
      // Try to decrypt the notes with the provided password and store in global state
      const success = await storeEncryptedNotes(encryptedData, password);

      if (success) {
        // Decryption successful, store password
        storePassword(password);

        // Redirect to the referrer URL or homepage
        if (referrer && typeof referrer === 'string') {
          router.push(referrer);
        } else {
          router.push('/');
        }
      } else {
        setError('Ungültiges Passwort');
      }
    } catch (error) {
      console.error('Decryption error:', error);
      setError('Entschlüsselung fehlgeschlagen');
    } finally {
      setIsCheckInProgress(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Lofs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Login</h1>


          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {error && (
                <div className="mb-4 text-red-600 dark:text-red-400 text-sm text-center font-medium">
                  {error}
                </div>
              )}
              
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
                isRequired
                className="w-full"
                autoFocus
              />
            </div>


            <Button
              type="submit"
              isLoading={isCheckInProgress}
              className="w-full"
            >
              Anmelden
            </Button>
          </form>
        </div>
      </div>
    </>
  );
} 