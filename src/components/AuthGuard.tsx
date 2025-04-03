import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getStoredPassword } from '@/utils/auth';
import useNotesStore from '@/store/notesStore';
import { loadEncryptedNotesFromWindow } from '@/utils/loadNotesClient';

interface AuthGuardProps {
  children: ReactNode;
}

// Pages that don't require authentication
const publicPaths = ['/login'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  
  // Get store functions and state
  const loadNotes = useNotesStore(state => state.storeEncryptedNotes);
  const resetNotes = useNotesStore(state => state.resetNotes);
  const isLoaded = useNotesStore(state => state.isLoaded);
  
  // Get encrypted data from memoized hook
  const encryptedData = loadEncryptedNotesFromWindow();

  // Load notes once when authenticated
  useEffect(() => {
    const initializeNotes = async () => {
      // Skip for public paths or when still loading data
      if (publicPaths.includes(router.pathname) || !authorized) {
        setLoadingNotes(false);
        return;
      }

      // Only load if not already loaded
      if (!isLoaded && encryptedData) {
        const password = getStoredPassword();
        
        if (password) {
          try {
            const success = await loadNotes(encryptedData, password);
            
            if (!success) {
              // Decryption failed with stored password - invalid auth
              setAuthorized(false);
              const currentPath = router.asPath;
              router.push(`/login?referrer=${encodeURIComponent(currentPath)}`);
            }
          } catch (error) {
            console.error('Error loading notes in AuthGuard:', error);
            // Authentication failed - redirect to login
            setAuthorized(false);
            const currentPath = router.asPath;
            router.push(`/login?referrer=${encodeURIComponent(currentPath)}`);
          }
        } else {
          // No password - auth failed
          setAuthorized(false);
          const currentPath = router.asPath;
          router.push(`/login?referrer=${encodeURIComponent(currentPath)}`);
        }
      }
      
      setLoadingNotes(false);
    };

    if (authorized) {
      initializeNotes();
    }
  }, [authorized, encryptedData, isLoaded, loadNotes, resetNotes, router]);

  useEffect(() => {
    // Verify authentication on route change
    const authCheck = () => {
      // Skip auth check for public paths
      if (publicPaths.includes(router.pathname)) {
        setAuthorized(true);
        return;
      }

      // Check if user is authenticated
      const auth = isAuthenticated();
      
      if (!auth) {
        resetNotes(); // Clear notes state on auth failure
        setAuthorized(false);
        // Redirect to login with referrer path
        const currentPath = router.asPath;
        router.push(`/login?referrer=${encodeURIComponent(currentPath)}`);
      } else {
        setAuthorized(true);
      }
    };

    // Check authentication status
    authCheck();

    // Add router event listener for route changes
    router.events.on('routeChangeComplete', authCheck);

    // Cleanup the event listener on component unmount
    return () => {
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [router, resetNotes]);

  // Show nothing while loading or unauthorized
  if (!authorized || loadingNotes) {
    return null;
  }

  return <>{children}</>;
} 
