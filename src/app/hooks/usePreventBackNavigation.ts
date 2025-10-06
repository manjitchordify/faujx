import { useEffect } from 'react';

const usePreventBackNavigation = (): void => {
  useEffect(() => {
    // Push the current state to history
    window.history.pushState(null, '', window.location.href);

    // Handle the back/forward button
    const handlePopState = (): void => {
      window.history.go(1);
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};

export default usePreventBackNavigation;
