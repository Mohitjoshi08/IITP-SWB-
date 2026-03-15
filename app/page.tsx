import { getSheetData } from '../lib/google-sheets';

export const dynamic = 'force-dynamic';

// Helper to check if current time is between open/close (24h format)
function isOpenBetween_e(openTime_e: string, closeTime_e: string, now_e: Date = new Date()) {
  if (!openTime_e || !closeTime_e) return false;
  
  try {
    const [openHour_e, openMinute_e] = openTime_e.split(':').map(Number);
    const [closeHour_e, closeMinute_e] = closeTime_e.split(':').map(Number);

    const nowMinutes_e = now_e.getHours() * 60 + now_e.getMinutes();
    const openMinutes_e = openHour_e * 60 + openMinute_e;
    const closeMinutes_e = closeHour_e * 60 + closeMinute_e;

    if (closeMinutes_e < openMinutes_e) {
      // Over midnight logic (e.g., 21:00 to 05:00)
      return nowMinutes_e >= openMinutes_e || nowMinutes_e < closeMinutes_e;
    }
    // Normal logic
    return nowMinutes_e >= openMinutes_e && nowMinutes_e < closeMinutes_e;
  } catch (err_e) {
    return false; // Fail gracefully if formatting is bad
  }
}

function getShopStatus_e(shop_e: any[], now_e: Date) {
  // shop_e[1] is Mode, shop_e[2] is Open Time, shop_e[3] is Close Time
  const mode_e = (shop_e[1] || 'closed').trim().toLowerCase(); 
  const openTime_e = shop_e[2] || '09:00';
  const closeTime_e = shop_e[3] || '21:00';

  // Explicit overrides
  if (mode_e === 'open') return 'OPEN';
  if (mode_e === 'closed') return 'CLOSED';
  
  // 'auto' mode evaluation
  return isOpenBetween_e(openTime_e, closeTime_e, now_e) ? 'OPEN' : 'CLOSED';
}

export default async function Home() {
  // Fetch columns A through D
  const rows_e = await getSheetData('Shops!A2:D');
  
  // FIX: Force the server date to evaluate in Indian Standard Time (IST)
  const serverTime_e = new Date();
  const now_e = new Date(serverTime_e.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      {/* --- Campaign Welcome Banner --- */}
      <div className="bg-surface-hover p-4 rounded-2xl border border-accent/40 mb-5 flex items-center gap-3 shadow-sm">
        <span className="text-accent font-bold">Hi! 👋</span>
        <span className="text-sm text-white">
          This resource portal is brought to you by{' '}
          <a 
            href="https://www.instagram.com/mohit_for_swb?igsh=MTBxd3Q3cnB6aDUzZw==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline decoration-accent underline-offset-4 hover:text-accent transition-colors"
          >
            Mohit Joshi
          </a>
          , SWB (Student Welfare Board) Candidate.
        </span>
      </div>
      {/* --- End Banner --- */}

      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Campus Live</h1>
        <p className="text-sm text-text-secondary mt-1">Real-time status of shops & eateries.</p>
      </header>

      {!rows_e || rows_e.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-lg text-accent font-semibold mb-2">Fetching live data...</span>
          <span className="text-sm text-accent font-bold bg-accent/10 px-4 py-1 rounded-full border border-accent/30 shadow mt-2">
            Mohit for SWB
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows_e.map((shop_e: any[], index_e: number) => {
            const shopName_e = shop_e[0] || "Unknown Shop";
            const status_e = getShopStatus_e(shop_e, now_e);
            const isOpen_e = status_e === 'OPEN';

            return (
              <div key={index_e} className="bg-surface border border-border-subtle p-3.5 rounded-2xl flex justify-between items-center active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOpen_e ? 'bg-green-500/10' : 'bg-surface-hover'}`}>
                    <span className={isOpen_e ? 'text-green-500' : 'text-text-secondary'}>🏪</span>
                  </div>
                  {/* Faded text for closed shops, bright text for open shops */}
                  <h2 className={`text-[15px] font-semibold tracking-tight ${isOpen_e ? 'text-white' : 'text-white/40'}`}>
                    {shopName_e}
                  </h2>
                </div>
                
                {/* The big OPEN/CLOSED pill on the right */}
                <div className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase ${
                  isOpen_e ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/5 text-red-500/70 border border-red-500/10'
                }`}>
                  {status_e}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}