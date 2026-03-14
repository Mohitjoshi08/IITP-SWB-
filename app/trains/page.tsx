'use client';

import { useState, useEffect } from 'react';
import { Clock, Loader2, ArrowRight } from 'lucide-react';
import { fetchTrainsBetweenStations } from './actions';

export default function TrainsPage() {
  const [direction, setDirection] = useState<'BTA_PNBE' | 'PNBE_BTA'>('BTA_PNBE');
  const [day, setDay] = useState<'today' | 'tomorrow'>('today');
  const [trains, setTrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugMsg, setDebugMsg] = useState<string | null>(null);

  const getDateString = (offsetDays: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric' as const, month: '2-digit' as const, day: '2-digit' as const };
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(date);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    async function loadTrains() {
      setLoading(true);
      setDebugMsg(null);
      
      const fromStation = direction === 'BTA_PNBE' ? 'BTA' : 'PNBE';
      const toStation = direction === 'BTA_PNBE' ? 'PNBE' : 'BTA';
      const targetDate = day === 'today' ? getDateString(0) : getDateString(1);
      
      const res = await fetchTrainsBetweenStations(fromStation, toStation, targetDate);
      
      if (res && res.success) {
        setTrains(res.trains);
      } else {
        setTrains([]);
        setDebugMsg(res?.debug || "Unknown API Error");
      }
      
      setLoading(false);
    }
    
    loadTrains();
  }, [direction, day]);

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Train Schedule</h1>
        <p className="text-sm text-text-secondary mt-1">Full day master schedule.</p>
      </header>

      {/* DIRECTION TABS */}
      <div className="flex bg-surface-hover p-1 rounded-xl mb-3 border border-border-subtle relative">
        <button onClick={() => setDirection('BTA_PNBE')} className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${direction === 'BTA_PNBE' ? 'bg-surface border border-border-subtle shadow-sm text-white' : 'text-text-secondary'}`}>
          Bihta <ArrowRight size={14} className={direction === 'BTA_PNBE' ? 'text-accent' : ''} /> Patna
        </button>
        <button onClick={() => setDirection('PNBE_BTA')} className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${direction === 'PNBE_BTA' ? 'bg-surface border border-border-subtle shadow-sm text-white' : 'text-text-secondary'}`}>
          Patna <ArrowRight size={14} className={direction === 'PNBE_BTA' ? 'text-accent' : ''} /> Bihta
        </button>
      </div>

      {/* DAY TABS */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setDay('today')} className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold tracking-wider uppercase transition-all border ${day === 'today' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-surface border-border-subtle text-text-secondary'}`}>
          Today
        </button>
        <button onClick={() => setDay('tomorrow')} className={`flex-1 py-1.5 rounded-lg text-[12px] font-bold tracking-wider uppercase transition-all border ${day === 'tomorrow' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-surface border-border-subtle text-text-secondary'}`}>
          Tomorrow
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-text-secondary gap-3">
            <Loader2 className="animate-spin text-accent" size={28} />
            <p className="text-[12px] font-medium tracking-wide">Downloading schedule...</p>
          </div>
        ) : trains.length === 0 ? (
          <div className="bg-surface border border-border-subtle p-6 rounded-2xl text-center flex flex-col gap-3">
            <p className="text-[13px] text-text-secondary">No trains found.</p>
            {/* THIS IS THE SMART DEBUGGER! IF IT FAILS, IT WILL TELL US WHY */}
            {debugMsg && (
              <div className="bg-black/50 p-3 rounded-lg border border-red-500/20 text-left overflow-x-auto">
                <span className="text-[10px] text-red-400 font-mono break-all">{debugMsg}</span>
              </div>
            )}
          </div>
        ) : (
          trains.map((train, index) => {
            const trainName = train.train_name || train.trainName || "Unknown Train";
            const trainNo = train.train_number || train.trainNo || "00000";
            const departureTime = train.from_std || train.departureTime || train.from_time || "--:--";
            const arrivalTime = train.to_sta || train.arrivalTime || train.to_time || "--:--";
            const duration = train.duration || "";

            return (
              <div key={index} className="bg-surface border border-border-subtle p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[15px] font-semibold text-white leading-tight pr-4">{trainName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded uppercase border border-accent/20">
                        {trainNo}
                      </span>
                      {duration && <span className="text-[10px] font-medium text-text-secondary">{duration} trip</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 pt-3 border-t border-border-subtle/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Departs</span>
                    <span className="text-[14px] font-bold text-white">{departureTime}</span>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <ArrowRight size={16} className="text-border-strong" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-0.5">Arrives</span>
                    <span className="text-[14px] font-bold text-white">{arrivalTime}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}