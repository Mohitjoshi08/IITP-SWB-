'use client';

import { useState, useEffect } from 'react';
import { submitComplaint, getComplaints } from './actions';
import { CheckCircle2, Loader2, Send, Clock, ShieldCheck } from 'lucide-react';

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [pastIssues, setPastIssues] = useState<any[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem('iitp_device_id');
    if (!id) {
      id = 'device_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('iitp_device_id', id);
    }
    setDeviceId(id);
  }, []);

  useEffect(() => {
    if (activeTab === 'track' && deviceId) {
      setLoadingIssues(true);
      getComplaints(deviceId).then((data) => {
        setPastIssues(data);
        setLoadingIssues(false);
      });
    }
  }, [activeTab, deviceId]);

  async function handleSubmit(formData: FormData) {
    setStatus('success');
    submitComplaint(formData, deviceId);
  }

  const getStatusStyle = (currentStatus: string) => {
    const s = currentStatus?.toLowerCase() || 'pending';
    if (s.includes('resolv') || s.includes('done')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (s.includes('progress') || s.includes('further')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
  };

  return (
    <div className="min-h-screen px-4 py-6 md:p-12 max-w-md mx-auto pb-28">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Reports</h1>
          <p className="text-sm text-text-secondary mt-1">Issues & tracking</p>
        </div>
        <div className="flex items-center gap-1.5 bg-surface-hover border border-border-subtle px-2 py-1 rounded-lg">
          <ShieldCheck size={12} className="text-green-400" />
          <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wide">Private</span>
        </div>
      </header>

      {/* TABS */}
      <div className="flex bg-surface-hover p-1 rounded-xl mb-6 border border-border-subtle">
        <button onClick={() => setActiveTab('submit')} className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${activeTab === 'submit' ? 'bg-surface border border-border-subtle shadow-sm text-white' : 'text-text-secondary'}`}>
          File Issue
        </button>
        <button onClick={() => setActiveTab('track')} className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${activeTab === 'track' ? 'bg-surface border border-border-subtle shadow-sm text-white' : 'text-text-secondary'}`}>
          My Reports
        </button>
      </div>

      {/* CONTENT: SUBMIT */}
      {activeTab === 'submit' && (
        status === 'success' ? (
          <div className="bg-surface border border-emerald-500/30 p-6 rounded-2xl text-center shadow-lg animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-[18px] font-semibold text-white mb-1">Issue Reported</h2>
            <p className="text-[13px] text-text-secondary mb-6">Your report was saved and I will look into it.</p>
            <button onClick={() => setStatus('idle')} className="bg-surface-hover text-white w-full py-2.5 rounded-xl text-[14px] font-semibold border border-border-subtle active:scale-[0.98] transition-transform">
              Submit Another
            </button>
          </div>
        ) : (
          <form action={handleSubmit} className="bg-surface border border-border-subtle p-5 rounded-2xl flex flex-col gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-text-secondary ml-1">Issue Title</label>
              <input required name="title" type="text" placeholder="e.g. Fan not working" className="bg-bg-main border border-border-subtle rounded-xl p-3 text-[14px] text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-text-secondary ml-1">Description</label>
              <textarea required name="description" rows={3} placeholder="Details about the problem..." className="bg-bg-main border border-border-subtle rounded-xl p-3 text-[14px] text-white focus:outline-none focus:border-accent transition-colors resize-none"></textarea>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-text-secondary ml-1">Contact Number <span className="text-red-500">*</span></label>
              <input
                required
                name="contact"
                type="text"
                placeholder="Your contact number"
                className="bg-bg-main border border-border-subtle rounded-xl p-3 text-[14px] text-white focus:outline-none focus:border-accent transition-colors"
              />
              <span className="text-[11px] text-text-secondary ml-1 mt-0.5">We may call if more info is needed. Include +91 if desired.</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-text-secondary ml-1">Image URL <span className="opacity-50">(Optional)</span></label>
              <input name="imageUrl" type="url" placeholder="Link to image" className="bg-bg-main border border-border-subtle rounded-xl p-3 text-[14px] text-white focus:outline-none focus:border-accent transition-colors" />
            </div>
            <button disabled={status === 'loading'} type="submit" className="bg-white text-black font-bold text-[15px] rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-[0.98] transition-all mt-2 disabled:opacity-70">
              {status === 'loading' ? <><Loader2 className="animate-spin" size={18} /> Sending...</> : <><Send size={18} /> Submit Report</>}
            </button>
          </form>
        )
      )}

      {/* CONTENT: TRACK */}
      {activeTab === 'track' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-300">
          {loadingIssues ? (
            <div className="flex justify-center p-10 text-text-secondary">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : pastIssues.length === 0 ? (
            <div className="bg-surface border border-border-subtle p-6 rounded-2xl text-center">
              <p className="text-[13px] text-text-secondary">No reports found from this device.</p>
            </div>
          ) : (
            pastIssues.map((issue, index) => {
              const timestamp = issue[0] || "Unknown Date";
              const title = issue[1] || "Untitled";
              const description = issue[2] || "No description.";
              const contact = issue[3] || ""; // Show contact if available
              const currentStatus = issue[5] || "Pending";

              return (
                <div key={index} className="bg-surface border border-border-subtle p-4 rounded-2xl shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold text-white text-[15px] leading-tight">{title}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(currentStatus)} shrink-0`}>
                      {currentStatus}
                    </span>
                  </div>
                  <p className="text-text-secondary text-[13px] leading-relaxed line-clamp-2">
                    {description}
                  </p>
                  {contact && (
                    <div className="flex items-center gap-1 mt-1 text-[12px] text-accent font-semibold">
                      Contact: <span className="ml-0.5">{contact}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-border-subtle/50 text-[11px] text-text-secondary font-medium">
                    <Clock size={12} />
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