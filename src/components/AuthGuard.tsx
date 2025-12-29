import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getStoredPassword } from '@/utils/auth';
import useNotesStore from '@/store/notesStore';
import { useEncryptedNotesClientSide } from '@/utils/loadNotesClient';
import { CircularProgress } from "@heroui/react";

interface AuthGuardProps {
  children: ReactNode;
}

// Pages that don't require authentication
const publicPaths = ['/login'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  
  // Get store functions and state
  const storeEncryptedNotes = useNotesStore(state => state.storeEncryptedNotes);
  const isLoaded = useNotesStore(state => state.isLoaded);
  
  const { encryptedNotes, progress } = useEncryptedNotesClientSide();

  // Try to load notes using the stored password
  useEffect(() => {
    if (!encryptedNotes) {
      return;
    }

    const checkAuth = async () => {
       // Skip for public paths
       if (publicPaths.includes(router.pathname)) {
        setAuthorized(true);
        return true;
      }

      // Only load if not already loaded
      if (!isLoaded && encryptedNotes) {
        const password = getStoredPassword();
        
        if (password) {
          try {
            const success = await storeEncryptedNotes(encryptedNotes, password);
            
            if (!success) {
              // Decryption failed with stored password - invalid auth
              return false;
            }
          } catch (error) {
            console.error('Error loading notes in AuthGuard:', error);
            // Authentication failed - redirect to login
            return false;
          }
        } else {
          // No password - auth failed
          return false;
        }
      }
      
      // If we get here, we're authorized
      return true;
    }

    checkAuth().then(isAuthorized => {
      if (!isAuthorized) {
        const currentPath = router.asPath;
        router.push(`/login?referrer=${encodeURIComponent(currentPath)}`);
      } else {
        setAuthorized(true);
      }
    });
  }, [encryptedNotes, isLoaded, storeEncryptedNotes, router]);

  // Show loading spinner while encryptedData is being fetched
  if (encryptedNotes == null) {
    return (
      <div className="fixed left-0 right-0 bottom-0 top-0 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <CircularProgress size='lg' label="Lade Daten..." color='primary' className="text-gray-900" value={progress ?? undefined} showValueLabel/>
        </div>
      </div>
    );
  }

  // Show nothing while unauthorized
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
} 
