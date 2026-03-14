'use client';

import { useState, useEffect } from 'react';
import { submitComplaint, getComplaints } from './actions';
import { CheckCircle2, Loader2, Send, Clock, Wrench } from 'lucide-react';

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [pastIssues, setPastIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);

  // Fetch previous complaints when the "Track Status" tab is clicked
  useEffect(() => {
    if (activeTab === 'track') {
      setLoadingIssues(true);
      getComplaints().then((data) => {
        setPastIssues(data);
        setLoadingIssues(false);
      });
    }
  }, [activeTab]);

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    await submitComplaint(formData);
    setStatus('success');
  }

  // Helper to color-code the status dynamically
  const getStatusStyle = (currentStatus: string) => {
    const s = currentStatus?.toLowerCase() || 'pending';
    if (s.includes('resolv') || s.includes('done')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (s.includes('progress') || s.includes('further')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-2xl mx-auto pb-32">
      <header className="mb-8 mt-4 md:mt-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Issue Tracker</h1>
        <p className="text-text-secondary">Report issues or track their resolution status.</p>
      </header>

      {/* TABS */}
      <div className="flex bg-surface-hover p-1 rounded-xl mb-8 border border-border-subtle">
        <button 
          onClick={() => setActiveTab('submit')} 
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'submit' ? 'bg-surface border border-border-subtle shadow-md text-white' : 'text-text-secondary hover:text-white'}`}
        >
          File an Issue
        </button>
        <button 
          onClick={() => setActiveTab('track')} 
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'track' ? 'bg-surface border border-border-subtle shadow-md text-white' : 'text-text-secondary hover:text-white'}`}
        >
          Track Status
        </button>
      </div>

      {/* TAB CONTENT: SUBMIT */}
      {activeTab === 'submit' && (
        status === 'success' ? (
          <div className="bg-surface border border-emerald-500/30 p-8 rounded-3xl text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Complaint Registered</h2>
            <p className="text-text-secondary mb-8">Your issue has been recorded successfully in the database.</p>
            <button onClick={() => setStatus('idle')} className="bg-surface-hover text-white px-8 py-3 rounded-xl font-bold border border-border-subtle hover:bg-border-subtle transition-colors">
              Submit Another Issue
            </button>
          </div>
        ) : (
          <form action={handleSubmit} className="bg-surface border border-border-subtle p-6 md:p-8 rounded-3xl shadow-lg flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">Issue Title</label>
              <input required name="title" type="text" placeholder="e.g. Fan not working in Room 214" className="bg-bg-main border border-border-subtle rounded-xl p-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">Description</label>
              <textarea required name="description" rows={4} placeholder="Please provide detailed information about the problem..." className="bg-bg-main border border-border-subtle rounded-xl p-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-secondary">Image URL <span className="text-text-secondary/50 font-normal">(Optional)</span></label>
              <input name="imageUrl" type="url" placeholder="Paste a link to an image (Google Drive, Imgur, etc.)" className="bg-bg-main border border-border-subtle rounded-xl p-3.5 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" />
            </div>
            <button disabled={status === 'loading'} type="submit" className="bg-white text-black font-bold text-lg rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> Submitting...</> : <><Send size={20} /> Submit Complaint</>}
            </button>
          </form>
        )
      )}

      {/* TAB CONTENT: TRACK */}
      {activeTab === 'track' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {loadingIssues ? (
            <div className="flex items-center justify-center p-12 text-text-secondary">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : pastIssues.length === 0 ? (
            <div className="bg-surface/50 border border-border-subtle p-8 rounded-3xl text-center">
              <p className="text-text-secondary">No recent issues found in the database.</p>
            </div>
          ) : (
            pastIssues.map((issue, index) => {
              const timestamp = issue[0] || "Unknown Date";
              const title = issue[1] || "Untitled Issue";
              const description = issue[2] || "No description provided.";
              const currentStatus = issue[4] || "Pending";

              return (
                <div key={index} className="bg-surface border border-border-subtle p-5 rounded-2xl shadow-md flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-white text-lg leading-tight">{title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border ${getStatusStyle(currentStatus)}`}>
                      {currentStatus}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                    {description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border-subtle text-xs text-text-secondary font-medium">
                    <Clock size={14} />
                    {timestamp}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}