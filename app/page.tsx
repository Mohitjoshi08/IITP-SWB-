import { getSheetData } from '../lib/google-sheets';

export const dynamic = 'force-dynamic';

// Helper to robustly parse TRUE/FALSE for Auto Open/Close
const isTrue = (value) =>
  typeof value === 'string'
    ? ['true', 'yes', '1'].includes(value.trim().toLowerCase())
    : !!value;

// Helper to check if current time is between open/close (24h format)
function isOpenBetween(openTime, closeTime, now = new Date()) {
  if (!openTime || !closeTime) return false;
  
  try {
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    if (closeMinutes < openMinutes) {
      // Over midnight
      return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
    }
    // Normal
    return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  } catch (e) {
    return false; // Fail gracefully if a cell has bad formatting
  }
}

function getShopStatus(shop, now = new Date()) {
  const autoOpen = isTrue(shop[1]);
  const autoClose = isTrue(shop[2]);
  const mode = (shop[3] || '').toLowerCase();
  const manualStatus = (shop[4] || '').toUpperCase();
  
  // Fallbacks in case cells are left completely empty
  const openTime = shop[5] || '09:00';
  const closeTime = shop[6] || '21:00';

  if (mode === 'manual') {
    return manualStatus === 'OPEN' ? 'OPEN' : 'CLOSED';
  }

  // AUTOMATION MODES
  if (autoOpen && autoClose) {
    return isOpenBetween(openTime, closeTime, now) ? 'OPEN' : 'CLOSED';
  }

  if (autoOpen && !autoClose) {
    try {
      const [openHour, openMinute] = openTime.split(':').map(Number);
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const openMinutes = openHour * 60 + openMinute;
      return nowMinutes >= openMinutes ? 'OPEN' : 'CLOSED';
    } catch (e) { return 'CLOSED'; }
  }

  if (!autoOpen && autoClose) {
    try {
      const [closeHour, closeMinute] = closeTime.split(':').map(Number);
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const closeMinutes = closeHour * 60 + closeMinute;
      return nowMinutes < closeMinutes ? 'OPEN' : 'CLOSED';
    } catch (e) { return 'CLOSED'; }
  }

  // Neither auto open/close: always closed
  return 'CLOSED';
}

export default async function Home() {
  // Read 7 columns per shop for automation
  const rows = await getSheetData('Shops!A2:G');
  
  // FIX: Force server date to evaluate in Indian Standard Time (IST)
  const serverTime = new Date();
  const now = new Date(serverTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

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

      {!rows || rows.length === 0 ? (
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
            const status = getShopStatus(shop, now);
            const isOpen = status === 'OPEN';
            const mode = (shop[3] || '').toLowerCase();

            return (
              <div key={index} className="bg-surface border border-border-subtle p-3.5 rounded-2xl flex justify-between items-center active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOpen ? 'bg-green-500/10' : 'bg-surface-hover'}`}>
                    <span className={isOpen ? 'text-green-500' : 'text-text-secondary'}>🏪</span>
                  </div>
                  <h2 className="text-[15px] font-semibold text-white tracking-tight">{shopName}</h2>
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-surface-hover text-text-secondary font-mono capitalize">
                    {mode || 'auto'}
                  </span>
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