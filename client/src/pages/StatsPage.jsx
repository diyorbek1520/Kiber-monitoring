// React hooklari statistika ma'lumotlarini yuklash, hisoblash va holatni boshqarish uchun ishlatiladi.
import { useEffect, useMemo, useState } from 'react';

// Recharts statistikani area chart ko'rinishida chiqarish uchun ishlatiladi.
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// API helperlari backenddan statistikani olish va xatolarni o'qish uchun ishlatiladi.
import { api, getErrorMessage } from '../api.js';

// Umumiy komponentlar yuklanish paneli va sahifa sarlavhasi uchun ishlatiladi.
import { LoadingPanel } from '../components/LoadingPanel.jsx';
import { TopBar } from '../components/TopBar.jsx';

export function StatsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tarix')
      .then((response) => setItems(response.data.natijalar || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const chart = useMemo(() => items
    .filter((item) => Number.isFinite(item.ball))
    .reverse()
    .map((item, index) => ({
      nomi: `${index + 1}`,
      ball: item.ball,
      xavf: 100 - item.ball
    })), [items]);

  const highRisk = items.filter((item) => ['Xavfli', 'Juda xavfli'].includes(item.xavfDarajasi)).length;

  return (
    <>
      <TopBar title="Risk statistikasi" subtitle="Audit ballari va xavfli tahlillar dinamikasi umumiy ko‘rinishda aks ettiriladi." />
      {loading && <LoadingPanel text="Statistika tayyorlanmoqda" />}
      {error && <p className="glass rounded-lg p-5 text-rose-300">{error}</p>}
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Metric label="Jami tahlil" value={items.length} />
        <Metric label="Yuqori risk" value={highRisk} />
        <Metric label="Grafik nuqtalari" value={chart.length} />
      </div>
      <section className="glass h-96 rounded-lg p-5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chart}>
            <defs>
              <linearGradient id="risk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 220, 255, .12)" />
            <XAxis dataKey="nomi" stroke="#bae6fd" />
            <YAxis stroke="#bae6fd" />
            <Tooltip contentStyle={{ background: '#07101f', border: '1px solid rgba(125,211,252,.25)', color: '#fff' }} />
            <Area type="monotone" dataKey="ball" stroke="#38bdf8" fill="url(#risk)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div className="glass rounded-lg p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-cyan-100">{value}</p>
    </div>
  );
}
