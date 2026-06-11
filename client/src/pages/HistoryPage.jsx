// React hooklari tarix ma'lumotlarini yuklash va holatni boshqarish uchun ishlatiladi.
import { useEffect, useState } from 'react';

// Lucide React tarix sahifasidagi vaqt ikonini ko'rsatish uchun ishlatiladi.
import { Clock } from 'lucide-react';

// API helperlari backenddan tarixni olish va xatolarni o'qish uchun ishlatiladi.
import { api, getErrorMessage } from '../api.js';

// Umumiy komponentlar yuklanish paneli va sahifa sarlavhasi uchun ishlatiladi.
import { LoadingPanel } from '../components/LoadingPanel.jsx';
import { TopBar } from '../components/TopBar.jsx';

export function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tarix')
      .then((response) => setItems(response.data.natijalar || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <TopBar title="Tahlillar tarixi" subtitle="Bajarilgan auditlar, fishing tekshiruvlari va maslahat so‘rovlari vaqt bo‘yicha saqlanadi." />
      {loading && <LoadingPanel text="Tarix yuklanmoqda" />}
      {error && <p className="glass rounded-lg p-5 text-rose-300">{error}</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item._id} className="glass rounded-lg p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-300/10 text-cyan-100">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold text-white">{typeLabel(item.turi)}</h2>
                  <p className="text-sm text-slate-400">{new Date(item.createdAt).toLocaleString('uz-UZ')}</p>
                </div>
              </div>
              <div className="text-sm text-cyan-100">{item.xavfDarajasi || 'Maslahat'}</div>
            </div>
          </article>
        ))}
        {!loading && items.length === 0 && <p className="glass rounded-lg p-5 text-slate-300">Hali tahlil bajarilmagan.</p>}
      </div>
    </>
  );
}

function typeLabel(type) {
  return {
    auditor: 'Kiber audit',
    fishing: 'Fishing tahlili',
    maslahatchi: 'Kiber maslahat'
  }[type] || type;
}
