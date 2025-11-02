import { useEffect, useRef } from 'react';

function WakeUpApp() {
  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      fetch(`${process.env.REACT_APP_RENDER_BASE_URL}/api/health`, {
        credentials: "include",
        method: 'GET'
      });
      didFetch.current = true;
    }
  }, []);

  return null;
}

export default WakeUpApp;
