import { useEffect } from 'react';
import { useHydrated } from 'remix-utils';

// Scroll to anchor on hydration manually, because we are not using Link component for anchors
export function useScrollToAnchor() {
  const hydrated = useHydrated();
  useEffect(() => {
    const hash = window.location.hash.trim();
    const el = hash !== '' ? document.querySelector(hash) : null;
    if (hydrated && el) el.scrollIntoView();
  }, [hydrated]);
}
