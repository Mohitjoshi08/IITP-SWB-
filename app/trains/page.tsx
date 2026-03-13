import { getSheetData } from '../../lib/google-sheets';
import { Clock, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TrainsPage() {
  const rows = await getSheetData('Trains!A2:E'); 

  // 1. Get current time in Indian Standard Time (IST)
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentMinutes = istTime.getHours() * 60 + istTime.getMinutes();

  // 2. Process and filter the trains
  const processedTrains = rows.map((train) => {
    const name = train[0];
    const number = train[1];
    const timeString = train[4]; // Example: "14:30"

    if (!timeString || !name) return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    const trainMinutes = hours * 60 + minutes;

    // Determine if the train is for Today or Tomorrow
    let day = "Today";
    let sortValue = trainMinutes;

    if (trainMinutes < currentMinutes) {
      day = "Tomorrow";
      sortValue += 24 * 60; // Add 24 hours to push it to the bottom
    }

    // Format time to standard 12-hour AM/PM format for a better UI
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const displayTime = `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    return { name, number, displayTime, day, sortValue };
  }).filter(Boolean);

  // 3. Sort trains so the soonest upcoming ones are at the top
  processedTrains.sort((a, b) => a!.sortValue - b!.sortValue);

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-3xl mx-auto pb-32">
      <header className="mb-10 mt-4 md:mt-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Train Schedule</h1>
        <p className="text-text-secondary">Bihta Station ➔ Patna Junction</p>
      </header>

      {processedTrains.length === 0 ? (
        <div className="bg-surface/50 border border-border-subtle p-8 rounded-3xl text-center">
          <p className="text-text-secondary">No trains found. Please check the Google Sheet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {processedTrains.map((train, index) => (
            <div key={index} className={`group bg-surface border border-border-subtle p-5 rounded-2xl flex justify-between items-center hover:bg-surface-hover transition-colors ${train!.day === 'Tomorrow' ? 'opacity-60' : ''}`}>
              
              {/* Left Side: Train Number & Name */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-md font-mono font-bold tracking-wider">
                    {train!.number}
                  </span>
                  <h3 className="font-semibold text-white text-lg tracking-tight">
                    {train!.name}
                  </h3>
                </div>
                
                {/* Day Tag (Today / Tomorrow) */}
                <div className="flex items-center gap-1.5 mt-1">
                  <Calendar size={14} className={train!.day === 'Today' ? 'text-green-400' : 'text-text-secondary'} />
                  <span className={`text-sm font-medium ${train!.day === 'Today' ? 'text-green-400' : 'text-text-secondary'}`}>
                    {train!.day}
                  </span>
                </div>
              </div>

              {/* Right Side: Time Box aligned perfectly */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 bg-surface-hover border border-border-subtle px-4 py-2.5 rounded-xl">
                  <Clock size={16} className={train!.day === 'Today' ? 'text-white' : 'text-text-secondary'} />
                  <span className={`text-xl font-bold tracking-tight ${train!.day === 'Today' ? 'text-white' : 'text-text-secondary'}`}>
                    {train!.displayTime}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}