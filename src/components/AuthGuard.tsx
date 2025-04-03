import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/utils/auth';

interface AuthGuardProps {
  children: ReactNode;
}

// Pages that don't require authentication
const publicPaths = ['/login'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

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
  }, [router]);

  return authorized ? <>{children}</> : null;
} 