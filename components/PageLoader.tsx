'use client';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative w-14 h-14 flex items-center justify-center mb-2">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
          <div className="w-8 h-8 bg-accent/90 rounded-full"></div>
        </div>
        {/* Loading text */}
        <div className="text-xl font-semibold text-white tracking-tight">Loading</div>
        {/* Campaign */}
        <div className="text-sm text-accent font-bold px-4 py-1 rounded-full bg-accent/10 border border-accent/30 shadow mt-1">
          Mohit for SWB
        </div>
      </div>
    </div>
  );
}