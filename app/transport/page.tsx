import { getSheetData } from '../../lib/google-sheets';
import { Car, MapPin, Phone, User, Banknote } from 'lucide-react';

// This line forces Vercel to fetch fresh data every time!
export const dynamic = 'force-dynamic';

export default async function TransportPage() {
  // Fetch data from the "Cabs" tab, columns A to E, starting from Row 2
  const rows = await getSheetData('Cabs!A2:E'); 

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-3xl mx-auto pb-32">
      <header className="mb-10 mt-4 md:mt-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Campus Transport</h1>
        <p className="text-text-secondary">Quickly contact reliable drivers for your commute.</p>
      </header>

      {(!rows || rows.length === 0) ? (
        <div className="bg-surface/50 border border-border-subtle p-8 rounded-3xl text-center">
          <p className="text-text-secondary">No drivers listed right now. Please add them to the Google Sheet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rows.map((ride, index) => {
            const type = ride[0] || "Vehicle";
            const driverName = ride[1] || "Unknown Driver";
            const phone = ride[2] || "";
            const fare = ride[3] || "Negotiable";
            const route = ride[4] || "Campus & Around";

            return (
              <div key={index} className="group bg-surface border border-border-subtle p-6 rounded-3xl hover:border-accent/50 transition-all duration-300 shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Car size={120} />
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <div className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                        {type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={20} className="text-text-secondary" />
                      <h2 className="text-xl font-semibold text-white tracking-tight">{driverName}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
                      <MapPin size={16} className="text-accent" />
                      {route}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-start md:items-end gap-4 border-t border-border-subtle pt-4 md:border-t-0 md:pt-0">
                    <div className="flex items-center gap-2 bg-surface-hover px-4 py-2 rounded-xl border border-border-subtle">
                      <Banknote size={18} className="text-green-400" />
                      <span className="text-sm font-bold text-white">{fare}</span>
                    </div>
                    {phone && (
                      <a href={`tel:${phone}`} className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors w-full md:w-auto justify-center shadow-md">
                        <Phone size={18} />
                        Call Driver
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}