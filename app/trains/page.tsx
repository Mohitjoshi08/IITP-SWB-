import { getSheetData } from '../../lib/google-sheets';

export default async function TrainsPage() {
  // This tells the app to look at the tab named "Trains" in your Google Sheet, from column A to E
  const rows = await getSheetData('Trains!A2:E'); 

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-neonBlue mb-2">Train Schedule</h1>
      <p className="text-textMuted mb-8">Bihta ➔ Patna</p>

      {rows.length === 0 ? (
        <div className="bg-surface p-6 rounded-xl border border-gray-800 text-center">
          <p className="text-neonPurple">No trains found or still loading...</p>
          <p className="text-sm text-textMuted mt-2">Make sure your Google Sheet has a tab named "Trains"!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((train, index) => (
            <div key={index} className="bg-surface p-4 rounded-xl border border-gray-800 flex justify-between items-center hover:border-neonBlue transition-colors">
              <div>
                <h3 className="font-bold text-white text-lg">{train[0]} <span className="text-textMuted text-sm font-normal">({train[1]})</span></h3>
                <p className="text-sm text-textMuted">{train[2]} ➔ {train[3]}</p>
              </div>
              <div className="text-2xl font-mono text-neonPurple font-bold bg-background px-3 py-1 rounded-lg border border-gray-800">
                {train[4]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}