import { getSheetData } from '../../lib/google-sheets';
import { Phone, MapPin, Car } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TransportPage() {
  const rows = await getSheetData('Cabs!A2:E');

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Campus Cabs</h1>
        <p className="text-sm text-text-secondary mt-1">Quick contacts for your commute.</p>
      </header>

      {(!rows || rows.length === 0) ? (
        <div className="bg-surface border border-border-subtle p-6 rounded-2xl text-center">
          <p className="text-sm text-text-secondary">No drivers listed right now.</p>
        </div>
      ) : (
        <>
          {/* New info banner */}
          <div className="mb-3 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-accent text-[13px] font-medium text-center">
            More contacts will be added soon.
          </div>

          <div className="flex flex-col gap-3">
            {rows.map((ride, index) => {
              const type = ride[0] || "Vehicle";
              const driverName = ride[1] || "Unknown Driver";
              const phone = ride[2] || "";
              const fare = ride[3] || "Negotiable";
              const route = ride[4] || "Campus & Around";

              return (
                <div key={index} className="bg-surface border border-border-subtle p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center border border-border-subtle shrink-0">
                        <Car className="text-text-secondary" size={18} />
                      </div>
                      <div>
                        <h2 className="text-[15px] font-semibold text-white leading-tight">{driverName}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded uppercase">
                            {type}
                          </span>
                          <span className="text-[12px] font-medium text-green-400">{fare}</span>
                        </div>
                      </div>
                    </div>

                    {phone && (
                      <a href={`tel:${phone}`} className="bg-white text-black p-2.5 rounded-xl hover:bg-gray-200 transition-colors active:scale-95 shrink-0">
                        <Phone size={16} className="fill-black" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-text-secondary text-[12px] font-medium bg-surface-hover/50 px-3 py-2 rounded-lg">
                    <MapPin size={12} className="text-accent shrink-0" />
                    <span className="truncate">{route}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}