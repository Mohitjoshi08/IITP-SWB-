'use client';

import { useState, useEffect } from 'react';
import { Clock, Loader2, MapPin, TrainTrack } from 'lucide-react';
import { fetchLiveTrains } from './actions';

export default function TrainsPage() {
  const [station, setStation] = useState<'BTA' | 'PNBE'>('BTA');
  const [trains, setTrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Whenever the tab changes (BTA or PNBE), fetch the live data!
  useEffect(() => {
    async function loadTrains() {
      setLoading(true);
      setError(false);
      
      const liveData = await fetchLiveTrains(station);
      
      if (liveData === null) {
        setError(true);
      } else {
        setTrains(liveData);
      }
      
      setLoading(false);
    }
    
    loadTrains();
  }, [station]);

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      <header className="mb-6 flex flex-col gap-1">
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-bold tracking-tight text-white">Live Trains</h1>
          <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg animate-pulse">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-[10px] font-bold text-green-500 tracking-wider uppercase">Live</span>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-1">Real-time arrival display board.</p>
      </header>

      {/* TABS: Bihta vs Patna */}
      <div className="flex bg-surface-hover p-1 rounded-xl mb-6 border border-border-subtle relative">
        <button 
          onClick={() => setStation('BTA')} 
          className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all z-10 ${station === 'BTA' ? 'bg-surface border border-border-subtle shadow-sm text-white' : 'text-text-secondary'}`}
        >
          Bihta (BTA)
        </button>
        <button 
          onClick={() => setStation('PNBE')} 
          className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all z-10 ${station === 'PNBE' ? 'bg-surface border border-border-subtle shadow-sm text-white' : 'text-text-secondary'}`}
        >
          Patna (PNBE)
        </button>
      </div>

      {/* CONTENT: Train List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-text-secondary gap-3">
            <Loader2 className="animate-spin text-accent" size={28} />
            <p className="text-[12px] font-medium tracking-wide">Connecting to IRCTC Server...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-center">
            <p className="text-[13px] text-red-400">Failed to connect to railway servers. Please try again later.</p>
          </div>
        ) : trains.length === 0 ? (
          <div className="bg-surface border border-border-subtle p-6 rounded-2xl text-center">
            <p className="text-[13px] text-text-secondary">No trains scheduled for this station in the next 4 hours.</p>
          </div>
        ) : (
          trains.map((train, index) => {
            // RapidAPI IRCTC returns different names for properties. We check a few common ones defensively:
            const trainName = train.trainName || train.train_name || "Unknown Train";
            const trainNo = train.trainNo || train.train_number || "00000";
            const expectedTime = train.eta || train.expected_arrival || "--:--";
            const delay = train.delay_in_mins || train.delay || 0;
            const platform = train.platform || "?";

            return (
              <div key={index} className="bg-surface border border-border-subtle p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[15px] font-semibold text-white leading-tight pr-4">{trainName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded uppercase border border-accent/20">
                        {trainNo}
                      </span>
                      {delay > 0 ? (
                        <span className="text-[10px] font-bold text-red-400">Delayed {delay}m</span>
                      ) : (
                        <span className="text-[10px] font-bold text-green-400">On Time</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1.5 bg-surface-hover px-2.5 py-1 rounded-lg border border-border-subtle">
                      <Clock size={12} className="text-text-secondary" />
                      <span className="text-[14px] font-bold text-white">{expectedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 pt-3 border-t border-border-subtle/50">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
                    <MapPin size={12} />
                    <span>Arriving at {station}</span>
                  </div>
                  <div className="text-[11px] font-bold text-white bg-bg-main px-2 py-0.5 rounded-md border border-border-subtle">
                    Platform {platform}
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