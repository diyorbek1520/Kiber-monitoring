// React hooklari profil formasi va saqlash holatini boshqarish uchun ishlatiladi.
import { useEffect, useState } from 'react';

// Lucide React profil sahifasidagi ikonlar uchun ishlatiladi.
import { LogOut, Save, UserRound } from 'lucide-react';

// API helperlari profil ma'lumotlarini o'qish va yangilash uchun ishlatiladi.
import { api, getErrorMessage } from '../api.js';

// TopBar sahifa sarlavhasi va yuqori panelni ko'rsatish uchun ishlatiladi.
import { TopBar } from '../components/TopBar.jsx';

export function ProfilePage({ user, onUserChange, onLogout }) {
  const [form, setForm] = useState({
    ism: user?.ism || '',
    email: user?.email || '',
    tashkilot: user?.tashkilot || '',
    telefon: user?.telefon || '',
    joriyParol: '',
    yangiParol: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm((current) => ({
      ...current,
      ism: user?.ism || '',
      email: user?.email || '',
      tashkilot: user?.tashkilot || '',
      telefon: user?.telefon || ''
    }));
  }, [user]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await api.patch('/auth/me', {
        ism: form.ism,
        email: form.email,
        tashkilot: form.tashkilot,
        telefon: form.telefon,
        joriyParol: form.joriyParol,
        yangiParol: form.yangiParol
      });
      onUserChange(response.data.user);
      setForm((current) => ({ ...current, joriyParol: '', yangiParol: '' }));
      setMessage('Profil ma‘lumotlari saqlandi');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar title="Profil" subtitle="Akkaunt ma'lumotlari va parol sozlamalarini boshqaring." />
      <form onSubmit={submit} className="glass max-w-3xl rounded-lg p-5">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100">
            <UserRound className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-semibold text-white">{form.ism}</h2>
            <p className="text-sm text-slate-400">{form.email}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ism" value={form.ism} onChange={(value) => updateField('ism', value)} />
          <Field label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} />
          <Field label="Tashkilot" value={form.tashkilot} onChange={(value) => updateField('tashkilot', value)} />
          <Field label="Telefon" value={form.telefon} onChange={(value) => updateField('telefon', value)} />
          <Field label="Joriy parol" type="password" value={form.joriyParol} onChange={(value) => updateField('joriyParol', value)} />
          <Field label="Yangi parol" type="password" value={form.yangiParol} onChange={(value) => updateField('yangiParol', value)} />
        </div>

        {message && <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{message}</p>}
        {error && <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}

        <button disabled={loading} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60">
          <Save className="h-5 w-5" />
          {loading ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
        <button type="button" onClick={onLogout} className="ml-3 mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 font-semibold text-rose-100 transition hover:bg-rose-400/15">
          <LogOut className="h-5 w-5" />
          Chiqish
        </button>
      </form>
    </>
  );
}

function Field({ label, value, onChange, type = 'text', disabled = false }) {
  return (
    <label className="block text-sm text-cyan-100">
      {label}
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-cyan-200/20 bg-black/25 px-4 text-white outline-none ring-cyan-300/30 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}
