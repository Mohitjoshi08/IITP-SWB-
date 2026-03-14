'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function LoadingOverlay() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // When path changes, show loading for minimum 750ms (nice effect)
    setLoading(true);
    timeout = setTimeout(() => setLoading(false), 750);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-colors animate-in fade-in duration-300">
      <div className="flex flex-col items-center">
        <div className="animate-bounce mb-6">
          <span className="text-accent text-5xl font-bold">🚀</span>
        </div>
        <div className="bg-accent/90 px-7 py-4 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-white">Loading...</h2>
          <p className="mt-2 text-lg text-white/90 font-bold">
            Mohit for SWB <span className="text-xs align-super bg-white/10 px-2 py-0.5 rounded text-accent-light ml-2">Student Welfare Board</span>
          </p>
        </div>
      </div>
    </div>
  );
}