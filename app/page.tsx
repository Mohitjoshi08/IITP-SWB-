'use client';
import { useEffect, useState } from 'react';


export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Call your public API route, which reads from Google Sheets
      const res = await fetch('/api/shops');
      const data = await res.json();
      setShops(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      {loading }

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Campus Live</h1>
        <p className="text-sm text-text-secondary mt-1">Real-time status of shops & eateries.</p>
      </header>
      {shops.length === 0 && !loading ? (
        <div className="bg-surface border border-border-subtle p-6 rounded-2xl text-center">
          <p className="text-sm text-text-secondary">No shops found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shops.map((shop, index) => {
            const shopName = shop[0] || shop.name || "Unknown Shop";
            const status = (shop[1] || shop.status || "").toUpperCase() || "CLOSED";
            const isOpen = status === 'OPEN';

            return (
              <div key={index} className="bg-surface border border-border-subtle p-3.5 rounded-2xl flex justify-between items-center active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOpen ? 'bg-green-500/10' : 'bg-surface-hover'}`}>
                    <span className={isOpen ? 'text-green-500' : 'text-text-secondary'}>🏪</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-white tracking-tight">{shopName}</h2>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase ${
                  isOpen ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/5 text-red-500/70 border border-red-500/10'
                }`}>
                  {status}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}