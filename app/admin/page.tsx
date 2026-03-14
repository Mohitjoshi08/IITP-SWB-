'use client';

import { useState, useEffect } from 'react';

type Contact = { name: string; person?: string; phone: string; info?: string; };
type Shop = { name: string; status: string; };

const CONTACT_SHEET = 'Contacts';
const SHOP_SHEET = 'Shops';

async function fetchAdminData(tab: string) {
  const res = await fetch(`/api/admin/${tab}`);
  if (res.ok) return res.json();
  return [];
}

async function saveAdminData(tab: string, password: string, data: any[]) {
  return fetch(`/api/admin/${tab}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, data }),
  }).then(res => res.ok);
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState<'contacts' | 'shops'>('contacts');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (auth) {
      setLoading(true);
      fetchAdminData(tab).then(data => setList(data)).finally(() => setLoading(false));
    }
  }, [auth, tab]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (
      password &&
      (await fetch('/api/admin/validate', { method: 'POST', body: password }).then(res => res.ok))
    ) {
      setAuth(true);
      setMsg('');
    } else {
      setMsg('Incorrect password');
    }
  }

  function handleChange(i: number, key: string, value: string) {
    setList(list.map((c, idx) => idx === i ? { ...c, [key]: value } : c));
  }

  function addRow() {
    if (tab === 'contacts') setList([...list, { name: '', phone: '' }]);
    else if (tab === 'shops') setList([...list, { name: '', status: '' }]);
  }

  function deleteRow(i: number) {
    setList(list.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setLoading(true);
    const ok = await saveAdminData(tab, password, list);
    setMsg(ok ? 'Saved ✅' : 'Failed to save ❌');
    setLoading(false);
  }

  if (!auth)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <form onSubmit={handleLogin} className="bg-surface p-8 rounded-2xl border border-border-subtle flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>
          <input
            className="p-3 rounded-xl border border-border-subtle text-lg outline-none"
            placeholder="Enter Admin Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="bg-accent text-white rounded-xl p-3 font-bold text-lg" type="submit">
            Login
          </button>
          {msg && <div className="text-red-500 text-sm">{msg}</div>}
        </form>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="flex gap-2 mb-5">
        <button
          className={`py-2 px-5 rounded font-bold border ${tab === 'contacts' ? 'bg-accent text-white ' : 'bg-surface-hover text-text-secondary '}`}
          onClick={() => setTab('contacts')}
        >Contacts</button>
        <button
          className={`py-2 px-5 rounded font-bold border ${tab === 'shops' ? 'bg-accent text-white ' : 'bg-surface-hover text-text-secondary '}`}
          onClick={() => setTab('shops')}
        >Shops</button>
      </div>
      {loading && <div>Loading...</div>}
      <div className="flex flex-col gap-4">
        {tab === 'contacts' && list.map((c: Contact, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 bg-surface-hover p-3 rounded-xl">
            <input className="flex-1 bg-bg-main border px-2 py-1 rounded" placeholder="Name" value={c.name} onChange={e => handleChange(i, 'name', e.target.value)} />
            <input className="flex-1 bg-bg-main border px-2 py-1 rounded" placeholder="Person" value={c.person ?? ''} onChange={e => handleChange(i, 'person', e.target.value)} />
            <input className="flex-1 bg-bg-main border px-2 py-1 rounded" placeholder="Phone" value={c.phone} onChange={e => handleChange(i, 'phone', e.target.value)} />
            <input className="flex-1 bg-bg-main border px-2 py-1 rounded" placeholder="Info" value={c.info ?? ''} onChange={e => handleChange(i, 'info', e.target.value)} />
            <button className="text-red-500 font-bold ml-2" onClick={() => deleteRow(i)}>Delete</button>
          </div>
        ))}
        {tab === 'shops' && list.map((s: Shop, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 bg-surface-hover p-3 rounded-xl">
            <input className="flex-1 bg-bg-main border px-2 py-1 rounded" placeholder="Shop Name" value={s.name} onChange={e => handleChange(i, 'name', e.target.value)} />
            <input className="flex-1 bg-bg-main border px-2 py-1 rounded" placeholder="Status (OPEN/CLOSED)" value={s.status} onChange={e => handleChange(i, 'status', e.target.value)} />
            <button className="text-red-500 font-bold ml-2" onClick={() => deleteRow(i)}>Delete</button>
          </div>
        ))}

        <button onClick={addRow} className="bg-accent text-white font-bold rounded-xl py-2">+ Add Row</button>
        <button onClick={handleSave} className="bg-green-600 text-white font-bold rounded-xl py-2">{loading ? 'Saving...' : 'Save All'}</button>
        {msg && <div className="text-green-500 text-lg">{msg}</div>}
      </div>
    </div>
  );
}