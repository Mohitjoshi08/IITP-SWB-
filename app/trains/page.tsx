import { getSheetData } from '../../lib/google-sheets';
import { Clock } from 'lucide-react';

// This is the magic line! It forces the app to fetch fresh live data every time.
export const dynamic = 'force-dynamic';

export default async function TrainsPage() {
  const rows = await getSheetData('Trains!A2:E'); 

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-3xl mx-auto pb-32">
      <header className="mb-10 mt-4 md:mt-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Train Schedule</h1>
        <p className="text-text-secondary">Bihta Station ➔ Patna Junction</p>
      </header>

      {rows.length === 0 ? (
        <div className="bg-surface/50 border border-border-subtle p-8 rounded-3xl text-center">
          <p className="text-text-secondary">No trains found. Please check the Google Sheet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((train, index) => (
            <div key={index} className="group bg-surface border border-border-subtle p-5 rounded-2xl flex justify-between items-center hover:bg-surface-hover transition-colors">
              <div>
                <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                  {train[0]} 
                  <span className="bg-white/10 text-text-secondary text-xs px-2 py-0.5 rounded-md font-medium">{train[1]}</span>
                </h3>
                <p className="text-sm text-text-secondary mt-1">{train[2]} to {train[3]}</p>
              </div>
              <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-2 rounded-xl">
                <Clock size={16} className="text-accent" />
                <span className="text-xl font-bold tracking-tight text-accent">{train[4]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}