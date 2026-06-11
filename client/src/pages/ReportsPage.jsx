// React hooklari hisobotlar ro'yxatini yuklash va holatni boshqarish uchun ishlatiladi.
import { useEffect, useState } from 'react';

// Lucide React hisobot va yuklab olish ikonlari uchun ishlatiladi.
import { Download, FileText } from 'lucide-react';

// API helperlari hisobotlarni olish, PDF yuklab olish va xatolarni o'qish uchun ishlatiladi.
import { api, downloadPdfReport, getErrorMessage } from '../api.js';

// Umumiy komponentlar yuklanish paneli va sahifa sarlavhasi uchun ishlatiladi.
import { LoadingPanel } from '../components/LoadingPanel.jsx';
import { TopBar } from '../components/TopBar.jsx';

export function ReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/hisobotlar')
      .then((response) => setItems(response.data.hisobotlar || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function downloadReport(id) {
    setError('');
    try {
      await downloadPdfReport(id);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <TopBar title="Hisobotlar" subtitle="Saqlangan natijalarni ko‘rib chiqing va PDF shaklida yuklab oling." />
      {loading && <LoadingPanel text="Hisobotlar yuklanmoqda" />}
      {error && <p className="glass rounded-lg p-5 text-rose-300">{error}</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item._id} className="glass rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <FileText className="mb-4 h-7 w-7 text-cyan-100" />
                <h2 className="font-semibold text-white">{typeLabel(item.turi)}</h2>
                <p className="mt-2 text-sm text-slate-400">{new Date(item.createdAt).toLocaleString('uz-UZ')}</p>
                {item.ball !== undefined && <p className="mt-2 text-sm text-cyan-100">Ball: {item.ball}</p>}
              </div>
              <button type="button" onClick={() => downloadReport(item._id)} className="inline-flex items-center gap-2 rounded-lg border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
                <Download className="h-4 w-4" />
                PDF
              </button>
            </div>
          </article>
        ))}
      </div>
      {!loading && items.length === 0 && <p className="glass rounded-lg p-5 text-slate-300">Hali hisobot mavjud emas.</p>}
    </>
  );
}

function typeLabel(type) {
  return {
    auditor: 'Kiber audit hisoboti',
    fishing: 'Fishing tahlili hisoboti',
    maslahatchi: 'Maslahat yozuvi'
  }[type] || type;
}
