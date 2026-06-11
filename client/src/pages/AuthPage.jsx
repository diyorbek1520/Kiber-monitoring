// React hooklari login/register formasi va sessiya holatini boshqarish uchun ishlatiladi.
import { useState } from 'react';

// Lucide React autentifikatsiya oynasidagi ikonlar uchun ishlatiladi.
import { LockKeyhole, ShieldCheck, UserPlus } from 'lucide-react';

// API helperlari auth endpointlariga so'rov yuborish va token saqlash uchun ishlatiladi.
import { api, getErrorMessage, setStoredToken } from '../api.js';

export function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ ism: '', email: '', parol: '', tashkilot: '', telefon: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isRegister = mode === 'register';

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, parol: form.parol };
      const response = await api.post(endpoint, payload);
      setStoredToken(response.data.token);
      onAuth(response.data.user);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid-bg px-4 py-8 text-slate-100">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full gap-6 lg:grid-cols-[1fr,420px]">
          <div className="flex flex-col justify-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 shadow-neon">
              <ShieldCheck className="h-8 w-8 text-cyan-100" />
            </div>
            <h1 className="max-w-3xl text-4xl font-bold text-white md:text-5xl">Kiber Himoya</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              Tahlillar, tarix va PDF hisobotlar har bir foydalanuvchi uchun alohida saqlanadi.
            </p>
          </div>

          <form onSubmit={submit} className="glass rounded-lg p-6">
            <div className="mb-6 flex rounded-lg border border-cyan-200/20 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${!isRegister ? 'bg-cyan-300 text-slate-950' : 'text-slate-300'}`}
              >
                Kirish
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold ${isRegister ? 'bg-cyan-300 text-slate-950' : 'text-slate-300'}`}
              >
                Ro&apos;yxatdan o&apos;tish
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100">
                {isRegister ? <UserPlus className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-white">{isRegister ? 'Yangi akkaunt' : 'Tizimga kirish'}</h2>
                <p className="text-sm text-slate-400">JWT sessiya brauzerda saqlanadi.</p>
              </div>
            </div>

            {isRegister && (
              <>
                <Field label="Ism" value={form.ism} onChange={(value) => updateField('ism', value)} autoComplete="name" />
                <Field label="Tashkilot" value={form.tashkilot} onChange={(value) => updateField('tashkilot', value)} autoComplete="organization" />
                <Field label="Telefon" value={form.telefon} onChange={(value) => updateField('telefon', value)} autoComplete="tel" />
              </>
            )}
            <Field label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} autoComplete="email" />
            <Field label="Parol" type="password" value={form.parol} onChange={(value) => updateField('parol', value)} autoComplete={isRegister ? 'new-password' : 'current-password'} />

            {error && <p className="mb-4 rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
            <button disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Tekshirilmoqda...' : isRegister ? 'Ro‘yxatdan o‘tish' : 'Kirish'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', autoComplete }) {
  return (
    <label className="mb-4 block text-sm text-cyan-100">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="mt-2 min-h-12 w-full rounded-lg border border-cyan-200/20 bg-black/25 px-4 text-white outline-none ring-cyan-300/30 focus:ring-4"
      />
    </label>
  );
}
