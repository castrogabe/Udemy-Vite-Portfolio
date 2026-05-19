import { useState, useEffect } from 'react';

/**
 * Ensures skeletons stay visible for at least delayMs,
 * and resets correctly even on fast reloads.
 */
export default function useDelayedLoading(fetchDone, delayMs = 2000) {
  const [delayDone, setDelayDone] = useState(false);

  useEffect(() => {
    // Reset timer when fetch starts (fetchDone = false)
    setDelayDone(false);
    const timer = setTimeout(() => setDelayDone(true), delayMs);
    return () => clearTimeout(timer);
  }, [fetchDone, delayMs]); // ✅ run every time fetchDone changes

  return !(fetchDone && delayDone);
}
