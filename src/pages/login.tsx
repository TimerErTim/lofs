import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Input } from '@heroui/react';
import { Button } from '@heroui/react';
import { isAuthenticated, storePassword } from '@/utils/auth';
import { loadEncryptedNotes } from '@/utils/loadNotes';
import { decryptNotes } from '@/utils/decryptNotes';
import { GetStaticProps } from 'next';

interface LoginPageProps {
  encryptedData: string;
}

export default function LoginPage({ encryptedData }: LoginPageProps) {
  const router = useRouter();
  const { referrer } = router.query;
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If user is already authenticated, redirect to homepage or referrer
  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuth = await isAuthenticated();
      if (isAuth) {
        const destination = referrer && typeof referrer === 'string' ? referrer : '/';
        router.push(destination);
      }
    };

    checkAuthentication();
  }, [router, referrer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Try to decrypt the notes with the provided password
      const notesData = await decryptNotes(encryptedData, password);
      
      if (notesData) {
        // Decryption successful, store password
        storePassword(password);
        
        // Redirect to the referrer URL or homepage
        if (referrer && typeof referrer === 'string') {
          router.push(referrer);
        } else {
          router.push('/');
        }
      } else {
        setError('Ungültiges Passwort. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Decryption error:', error);
      setError('Entschlüsselung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Tägliche Liebesnotizen</title>
        <meta name="description" content="Login für private Liebesnotizen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            
            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              isLoading={isLoading}
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