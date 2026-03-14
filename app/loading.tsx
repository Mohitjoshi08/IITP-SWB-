import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#09090b]">
      <div className="bg-surface border border-border-subtle p-6 rounded-3xl flex flex-col items-center gap-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
          <Loader2 className="animate-spin text-accent" size={24} />
        </div>
        <p className="text-text-secondary text-sm font-medium tracking-wide">Fetching live data...</p>
        <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/30 px-4 py-1 rounded-full mt-2 shadow">
          Mohit for SWB
        </span>
      </div>
    </div>
  );
}