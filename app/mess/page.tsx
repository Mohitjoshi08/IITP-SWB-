import { getSheetData } from '../../lib/google-sheets';
import { Coffee, Sun, Cookie, Moon } from 'lucide-react';

export const dynamic = 'force-dynamic';

// --- THE TIMING BRAIN ---
// Change the times inside the quotes below to match your exact campus rules!
function getMealTimings(dayName: string) {
  const day = dayName.toLowerCase();

  // 1. WEEKEND TIMINGS (Sat - Sun)
  if (day === 'saturday' || day === 'sunday') {
    return {
      breakfast: '08:30 AM - 10:30 AM', 
      lunch: '12:45 PM - 02:30 PM',
      snacks: '05:30 PM - 06:35 PM',
      dinner: '08:00 PM - 10:00 PM'
    };
  } 
  // 2. FRIDAY TIMINGS
  else if (day === 'friday') {
    return {
      breakfast: '07:30 AM - 09:45 AM',
      lunch: '12:30 PM - 02:15 PM', // Adjusted for Friday
      snacks: '05:30 PM - 06:30 PM',
      dinner: '08:00 PM - 10.00 PM'
    };
  } 
  // 3. REGULAR TIMINGS (Mon - Thu)
  else {
    return {
      breakfast: '08:00 AM - 10:0 AM',
      lunch: '12:45 PM - 02:15 PM',
      snacks: '05:30 PM - 06:30 PM',
      dinner: '08:00 PM - 10:00 PM'
    };
  }
}

export default async function MessPage() {
  const rows = await getSheetData('Mess!A2:E'); 
  const date = new Date();
  const options = { timeZone: 'Asia/Kolkata', weekday: 'long' as const };
  const todayName = new Intl.DateTimeFormat('en-US', options).format(date);
  
  // Find today's row in the Google Sheet
  const todaysMenu = rows.find(row => row[0]?.trim().toLowerCase() === todayName.toLowerCase());
  
  // Get the correct timings based on today's name
  const timings = getMealTimings(todayName);

  const meals = [
    { name: 'Breakfast', items: todaysMenu?.[1] || 'Menu not updated yet.', icon: Coffee, time: timings.breakfast },
    { name: 'Lunch', items: todaysMenu?.[2] || 'Menu not updated yet.', icon: Sun, time: timings.lunch },
    { name: 'Snacks', items: todaysMenu?.[3] || 'Menu not updated yet.', icon: Cookie, time: timings.snacks },
    { name: 'Dinner', items: todaysMenu?.[4] || 'Menu not updated yet.', icon: Moon, time: timings.dinner },
  ];

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mess Menu</h1>
          <p className="text-sm text-text-secondary mt-1">Today's schedule</p>
        </div>
        <div className="bg-surface-hover border border-border-subtle px-3 py-1.5 rounded-lg">
          <span className="text-[11px] font-bold text-accent tracking-wider uppercase">{todayName}</span>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {meals.map((meal, index) => {
          const Icon = meal.icon;
          return (
            <div key={index} className="bg-surface border border-border-subtle p-4 rounded-2xl flex gap-3.5">
              <div className="w-10 h-10 bg-surface-hover rounded-xl flex items-center justify-center shrink-0 border border-border-subtle">
                <Icon className="text-accent" size={18} />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex justify-between items-center mb-1.5">
                  <h2 className="text-[15px] font-semibold text-white leading-none">{meal.name}</h2>
                  <span className="text-[10px] font-medium text-text-secondary bg-bg-main px-2 py-0.5 rounded-md whitespace-nowrap ml-2">
                    {meal.time}
                  </span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed pr-2">
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