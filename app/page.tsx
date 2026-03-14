import { Store } from 'lucide-react';
import { getSheetData } from '../lib/google-sheets';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const rows = await getSheetData('Shops!A2:B'); 

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto pb-32">
      <header className="mb-10 mt-4 md:mt-0">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Campus Live</h1>
        <p className="text-text-secondary text-lg">Real-time status of shops and eateries.</p>
      </header>
      
      {rows.length === 0 ? (
        <div className="bg-surface/50 border border-border-subtle p-8 rounded-3xl text-center">
          <p className="text-text-secondary">No shops found. Please add them to your Google Sheet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map((shop, index) => {
            const shopName = shop[0] || "Unknown Shop";
            const status = shop[1]?.toUpperCase() || "CLOSED"; 
            const isOpen = status === 'OPEN';

            return (
              <div key={index} className="group bg-surface border border-border-subtle p-6 rounded-3xl flex justify-between items-center hover:bg-surface-hover transition-all duration-300 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isOpen ? 'bg-green-500/10' : 'bg-surface-hover'}`}>
                    <Store className={isOpen ? 'text-green-500' : 'text-text-secondary'} size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">{shopName}</h2>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider border ${
                  isOpen ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-red-500/5 text-red-500/70 border-red-500/10'
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