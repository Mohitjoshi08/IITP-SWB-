import { getSheetData } from '../lib/google-sheets';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const rows = await getSheetData('Shops!A2:B'); 

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      {/* --- Campaign Welcome Banner --- */}
      <div className="bg-surface-hover p-4 rounded-2xl border border-accent/40 mb-5 flex items-center gap-3 shadow-sm">
        <span className="text-accent font-bold">Hi! 👋</span>
        <span className="text-sm text-white">
          This resource portal is brought to you by{' '}
          <span className="underline decoration-accent underline-offset-4">Mohit Joshi</span>
          , SWB (Student Welfare Board) Candidate.
        </span>
      </div>
      {/* --- End Banner --- */}

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Campus Live</h1>
        <p className="text-sm text-text-secondary mt-1">Real-time status of shops & eateries.</p>
      </header>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-lg text-accent font-semibold mb-2">Fetching live data...</span>
          <span className="text-sm text-accent font-bold bg-accent/10 px-4 py-1 rounded-full border border-accent/30 shadow mt-2">
            Mohit for SWB
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((shop, index) => {
            const shopName = shop[0] || "Unknown Shop";
            const status = shop[1]?.toUpperCase() || "CLOSED"; 
            const isOpen = status === 'OPEN';

            return (
              <div key={index} className="bg-surface border border-border-subtle p-3.5 rounded-2xl flex justify-between items-center active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOpen ? 'bg-green-500/10' : 'bg-surface-hover'}`}>
                    {/* You can substitute your icon here */}
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