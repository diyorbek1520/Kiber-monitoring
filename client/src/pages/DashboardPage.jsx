// Framer Motion bosh sahifadagi kartalarga animatsiya berish uchun ishlatiladi.
import { motion } from 'framer-motion';

// Lucide React dashboarddagi bo'lim ikonlari uchun ishlatiladi.
import { Bot, MessageSquareText, Radar, ShieldCheck } from 'lucide-react';

// TopBar sahifa sarlavhasi va yuqori panelni ko'rsatish uchun ishlatiladi.
import { TopBar } from '../components/TopBar.jsx';

const modules = [
  {
    id: 'auditor',
    title: 'AI Kiber Auditor',
    text: 'Domen, URL yoki IP manzilni haqiqiy xavfsizlik tekshiruvlaridan o‘tkazing.',
    icon: Radar
  },
  {
    id: 'fishing',
    title: 'AI Fishing Aniqlovchi',
    text: 'Xabarlar, SMS, Telegram matnlari va havolalardagi firibgarlik alomatlarini aniqlang.',
    icon: ShieldCheck
  },
  {
    id: 'maslahatchi',
    title: 'AI Kiber Maslahatchi',
    text: 'Kichik biznes va startaplar uchun amaliy kiberxavfsizlik maslahatlarini oling.',
    icon: MessageSquareText
  }
];

export function DashboardPage({ onOpen }) {
  return (
    <>
      <TopBar title="KIBER MONITORING TIZIMI" subtitle="Kichik bizneslar va startaplar uchun sun’iy intellekt yordamida audit, fishing tahlili va maslahat markazi." />
      <section className="grid gap-5 xl:grid-cols-3">
        {modules.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => onOpen(item.id)}
              className="glass group min-h-[330px] rounded-lg p-6 text-left transition hover:-translate-y-1 hover:border-cyan-200/45 hover:shadow-neon"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="grid h-16 w-16 place-items-center rounded-lg border border-cyan-200/25 bg-cyan-300/10 text-cyan-100">
                  <Icon className="h-8 w-8" />
                </span>
                <Bot className="h-7 w-7 text-cyan-200/60 transition group-hover:text-cyan-100" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
              <span className="mt-10 inline-flex rounded-lg border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                Modulni ochish
              </span>
            </motion.button>
          );
        })}
      </section>
      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        {['Haqiqiy skanerlar', 'AI tahlil', 'PDF hisobot'].map((item) => (
          <div key={item} className="rounded-lg border border-cyan-200/12 bg-white/5 p-5">
            <p className="text-sm font-medium text-cyan-100">{item}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">Natijalar saqlanadi va risk statistikasi uchun ishlatiladi.</p>
          </div>
        ))}
      </section>
    </>
  );
}
