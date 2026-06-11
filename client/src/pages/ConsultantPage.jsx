// React hooki savol, javob va yuklanish holatini boshqarish uchun ishlatiladi.
import { useState } from 'react';

// Lucide React yuborish tugmasi ikonini ko'rsatish uchun ishlatiladi.
import { SendHorizonal } from 'lucide-react';

// API helperlari maslahatchi endpointiga so'rov yuborish va xatolarni o'qish uchun ishlatiladi.
import { api, getErrorMessage } from '../api.js';

// Umumiy komponentlar yuklanish paneli va sahifa sarlavhasi uchun ishlatiladi.
import { LoadingPanel } from '../components/LoadingPanel.jsx';
import { TopBar } from '../components/TopBar.jsx';

export function ConsultantPage() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!question.trim()) return;
    const userMessage = { rol: 'foydalanuvchi', matn: question.trim() };
    setMessages((items) => [...items, userMessage]);
    setQuestion('');
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/maslahatchi', { savol: userMessage.matn, tarix: messages });
      setMessages((items) => [...items, { rol: 'maslahatchi', matn: response.data.javob }]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar title="AI Kiber Maslahatchi" subtitle="Xodimlar, onlayn do‘kon, parol siyosati, zaxira nusxa, bulut va himoya jarayonlari bo‘yicha savol bering." />
      <section className="glass flex h-[calc(100vh-190px)] min-h-[560px] flex-col rounded-lg p-5">
        <div className="uz-scroll flex-1 space-y-4 overflow-y-auto pr-2">
          {messages.length === 0 && (
            <div className="rounded-lg border border-cyan-200/14 bg-cyan-300/8 p-5 text-sm leading-7 text-slate-300">
              Masalan: “Bizda 10 ta xodim bor. Qanday himoyalanish kerak?” yoki “Onlayn do‘konimiz uchun qanday xavfsizlik kerak?”
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.rol === 'foydalanuvchi' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl whitespace-pre-wrap rounded-lg p-4 text-sm leading-7 ${message.rol === 'foydalanuvchi' ? 'bg-cyan-300 text-slate-950' : 'border border-cyan-200/14 bg-black/24 text-slate-100'}`}>
                {message.matn}
              </div>
            </div>
          ))}
          {loading && <LoadingPanel text="Maslahatchi javob tayyorlamoqda" />}
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </div>
        <form onSubmit={submit} className="mt-4 flex gap-3">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-h-12 flex-1 rounded-lg border border-cyan-200/20 bg-black/25 px-4 text-white outline-none ring-cyan-300/30 focus:ring-4"
            placeholder="Savolingizni yozing"
          />
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 font-semibold text-slate-950 transition hover:bg-cyan-200">
            <SendHorizonal className="h-5 w-5" />
            Yuborish
          </button>
        </form>
      </section>
    </>
  );
}
