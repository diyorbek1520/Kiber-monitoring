// React hooki phishing tahlil formasi va natija holatini boshqarish uchun ishlatiladi.
import { useState } from 'react';

// Lucide React phishing tekshiruv tugmasi ikonini ko'rsatish uchun ishlatiladi.
import { ScanSearch } from 'lucide-react';

// Recharts phishing xavf darajasini doira grafikda ko'rsatish uchun ishlatiladi.
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// API helperlari backendga so'rov yuborish va xatolarni o'qish uchun ishlatiladi.
import { api, getErrorMessage } from '../api.js';

// Umumiy komponentlar yuklanish, markdown va yuqori panelni ko'rsatish uchun ishlatiladi.
import { LoadingPanel } from '../components/LoadingPanel.jsx';
import { MarkdownBlock } from '../components/MarkdownBlock.jsx';
import { TopBar } from '../components/TopBar.jsx';

export function FishingPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await api.post('/fishing', { matn: text });
      setResult(response.data.natija);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const percent = result?.ehtimol ?? 0;
  const chart = [
    { nomi: 'Xavf', qiymat: percent },
    { nomi: 'Ishonchli qism', qiymat: 100 - percent }
  ];

  return (
    <>
      <TopBar title="AI Fishing Aniqlovchi" subtitle="Email, SMS, Telegram xabari yoki havolani fishing va firibgarlik alomatlari bo‘yicha AI orqali tahlil qiladi." />
      <form onSubmit={submit} className="glass rounded-lg p-5">
        <label className="text-sm text-cyan-100">Matn yoki havola</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="mt-3 min-h-56 w-full resize-y rounded-lg border border-cyan-200/20 bg-black/25 p-4 text-white outline-none ring-cyan-300/30 focus:ring-4"
          placeholder="Shubhali xabar, SMS yoki havolani kiriting"
        />
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        <button className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200">
          <ScanSearch className="h-5 w-5" />
          Tahlil qilish
        </button>
      </form>
      {loading && <div className="mt-5"><LoadingPanel text="Fishing alomatlari tekshirilmoqda" /></div>}
      {result && (
        <section className="glass mt-5 grid gap-6 rounded-lg p-5 lg:grid-cols-[300px,1fr]">
          <div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chart} dataKey="qiymat" innerRadius={72} outerRadius={105} paddingAngle={3}>
                    <Cell fill="#fb7185" />
                    <Cell fill="rgba(255,255,255,.12)" />
                  </Pie>
                  <Tooltip contentStyle={{ background: '#07101f', border: '1px solid rgba(125,211,252,.25)', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-4xl font-bold text-rose-300">{percent || 'Aniqlanmadi'}{percent ? '%' : ''}</p>
            <p className="mt-2 text-center text-sm text-slate-400">Fishing ehtimoli</p>
          </div>
          <MarkdownBlock text={result.aiTahlil} />
        </section>
      )}
    </>
  );
}
