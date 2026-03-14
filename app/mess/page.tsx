import { getSheetData } from '../../lib/google-sheets';
import { Coffee, Sun, Cookie, Moon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MessPage() {
  // Fetch columns A to E (Day, Breakfast, Lunch, Snacks, Dinner)
  const rows = await getSheetData('Mess!A2:E'); 

  // Figure out what day it is TODAY in India
  const date = new Date();
  const options = { timeZone: 'Asia/Kolkata', weekday: 'long' as const };
  const todayName = new Intl.DateTimeFormat('en-US', options).format(date);

  // Search the Google Sheet for the row that matches today's day
  const todaysMenu = rows.find(row => row[0]?.trim().toLowerCase() === todayName.toLowerCase());

  // Setup the 4 exact sections you requested
  const meals = [
    { name: 'Breakfast', items: todaysMenu?.[1] || 'Menu not updated yet.', icon: Coffee, time: '07:30 AM - 09:30 AM' },
    { name: 'Lunch', items: todaysMenu?.[2] || 'Menu not updated yet.', icon: Sun, time: '12:30 PM - 02:30 PM' },
    { name: 'Snacks', items: todaysMenu?.[3] || 'Menu not updated yet.', icon: Cookie, time: '05:00 PM - 06:15 PM' },
    { name: 'Dinner', items: todaysMenu?.[4] || 'Menu not updated yet.', icon: Moon, time: '07:30 PM - 09:30 PM' },
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-3xl mx-auto pb-32">
      <header className="mb-8 mt-4 md:mt-0 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Mess Menu</h1>
          {/* Beautiful Badge showing Today's Day */}
          <div className="bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-xl">
            <span className="text-accent font-bold tracking-wide uppercase text-sm">{todayName}</span>
          </div>
        </div>
        <p className="text-text-secondary mt-1">Today's food schedule.</p>
      </header>

      {!todaysMenu && (
        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl text-orange-400 text-sm mb-6 font-medium">
          Note: Could not find "{todayName}" in the Google Sheet. Showing default empty menu.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.map((meal, index) => {
          const Icon = meal.icon;

          return (
            <div key={index} className="bg-surface border border-border-subtle p-6 rounded-3xl shadow-lg flex flex-col gap-4 relative overflow-hidden group hover:border-border-strong transition-colors">
              {/* Background watermark icon */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <Icon size={120} />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-hover rounded-2xl flex items-center justify-center border border-border-subtle">
                    <Icon className="text-accent" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{meal.name}</h2>
                    <span className="text-xs font-medium text-text-secondary">{meal.time}</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-surface-hover/50 p-4 rounded-2xl border border-border-subtle/50 min-h-[80px]">
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {meal.items}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}