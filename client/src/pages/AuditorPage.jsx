// React hooki forma qiymatlari, yuklanish va natija holatini boshqarish uchun ishlatiladi.
import { useState } from 'react';

// Lucide React auditor sahifasidagi tugma ikonlari uchun ishlatiladi.
import { Download, PlayCircle } from 'lucide-react';

// API helperlari backendga so'rov yuborish, PDF yuklash va xatolarni o'qish uchun ishlatiladi.
import { api, downloadPdfReport, getErrorMessage } from '../api.js';

// Umumiy komponentlar yuklanish, markdown, ball va yuqori panelni ko'rsatish uchun ishlatiladi.
import { LoadingPanel } from '../components/LoadingPanel.jsx';
import { MarkdownBlock } from '../components/MarkdownBlock.jsx';
import { ScoreRing } from '../components/ScoreRing.jsx';
import { TopBar } from '../components/TopBar.jsx';

export function AuditorPage() {
  const [target, setTarget] = useState('');
  const [result, setResult] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await api.post('/auditor', { manzil: target });
      setResult(response.data.natija);
      setReportId(response.data.id);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function downloadReport() {
    if (!reportId) return;
    try {
      await downloadPdfReport(reportId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <TopBar title="AI Kiber Auditor" subtitle="Domen, URL yoki IP manzilni SSL, HTTPS, sarlavhalar, email himoyasi, DNS va portlar bo‘yicha tekshiradi." />
      <form onSubmit={submit} className="glass mb-5 rounded-lg p-5">
        <label className="text-sm text-cyan-100">Domen, URL yoki IP manzil</label>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <input
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="namuna.uz yoki https://namuna.uz"
            className="min-h-12 flex-1 rounded-lg border border-cyan-200/20 bg-black/25 px-4 text-white outline-none ring-cyan-300/30 focus:ring-4"
          />
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200">
            <PlayCircle className="h-5 w-5" />
            Tahlilni Boshlash
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      </form>
      {loading && <LoadingPanel text="Kiber audit bajarilmoqda" />}
      {result && (
        <div className="space-y-5">
          <div className="glass rounded-lg p-5">
            <ScoreRing value={result.ball} label={result.baho} />
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title="SSL va HTTPS">
              <Row label="SSL mavjudligi" value={result.ssl.mavjud ? 'Mavjud' : 'Mavjud emas'} />
              <Row label="Amal qilish muddati" value={result.ssl.amalQilishMuddati || 'Aniqlanmadi'} />
              <Row label="Sertifikat beruvchi" value={result.ssl.beruvchi || 'Aniqlanmadi'} />
              <Row label="HTTPS holati" value={result.https.ishlayapti ? 'Ishlayapti' : 'Ishlamayapti'} />
              <Row label="HSTS holati" value={result.https.hsts ? 'Mavjud' : 'Mavjud emas'} />
            </Panel>
            <Panel title="Email va DNS">
              <Row label="SPF" value={result.email.spf.mavjud ? 'Mavjud' : 'Mavjud emas'} />
              <Row label="DKIM" value={result.email.dkim.ehtimoliyMavjud ? 'Ehtimol mavjud' : 'Topilmadi'} />
              <Row label="DMARC" value={result.email.dmarc.mavjud ? 'Mavjud' : 'Mavjud emas'} />
              <Row label="A yozuvlari" value={result.dns.a.join(', ') || 'Yo‘q'} />
              <Row label="NS yozuvlari" value={result.dns.ns.join(', ') || 'Yo‘q'} />
            </Panel>
          </div>
          <Panel title="Port tekshiruvi">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
              {result.ports.map((port) => (
                <div key={port.port} className={`rounded-lg border p-3 ${port.ochiq ? 'border-rose-300/40 bg-rose-400/10' : 'border-emerald-300/20 bg-emerald-400/8'}`}>
                  <p className="font-semibold">{port.port}</p>
                  <p className="text-sm text-slate-300">{port.ochiq ? 'Ochiq' : 'Yopiq'}</p>
                  {port.xizmat && <p className="text-xs text-cyan-100">{port.xizmat}</p>}
                  {port.izoh && <p className="text-xs text-slate-400">{port.izoh}</p>}
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="AI tahlil">
            <MarkdownBlock text={result.aiTahlil} />
            {reportId && (
              <button type="button" onClick={downloadReport} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                <Download className="h-4 w-4" />
                PDF yuklab olish
              </button>
            )}
          </Panel>
        </div>
      )}
    </>
  );
}

function Panel({ title, children }) {
  return (
    <section className="glass rounded-lg p-5">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/8 py-3 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="max-w-[62%] text-right text-slate-100">{value}</span>
    </div>
  );
}
