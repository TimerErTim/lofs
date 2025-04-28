import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getStoredPassword } from '@/utils/auth';
import useNotesStore from '@/store/notesStore';
import { useEncryptedNotesClientSide } from '@/utils/loadNotesClient';

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
  const resetNotes = useNotesStore(state => state.resetNotes);
  const isLoaded = useNotesStore(state => state.isLoaded);
  
  const encryptedData = useEncryptedNotesClientSide();

  // Try to load notes using the stored password
  useEffect(() => {
    if (!encryptedData) {
      return;
    }

    const checkAuth = async () => {
       // Skip for public paths
       if (publicPaths.includes(router.pathname)) {
        setAuthorized(true);
        return true;
      }

      // Only load if not already loaded
      if (!isLoaded && encryptedData) {
        const password = getStoredPassword();
        
        if (password) {
          try {
            const success = await storeEncryptedNotes(encryptedData, password);
            
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
  }, [encryptedData, isLoaded, storeEncryptedNotes, resetNotes, router]);

  // Show nothing while unauthorized
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
} 
