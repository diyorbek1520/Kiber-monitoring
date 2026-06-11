// Framer Motion sahifalar va panel elementlariga animatsiya berish uchun ishlatiladi.
import { motion } from 'framer-motion';

// Lucide React navigatsiya menyusidagi ikonlar uchun ishlatiladi.
import { Activity, ArrowLeft, BarChart3, FileText, History, LogOut, ShieldCheck, UserRound } from 'lucide-react';

export function Layout({ active, onNavigate, onBack, canBack, user, onLogout, children }) {
  const items = [
    { id: 'bosh', label: 'Modullar', icon: ShieldCheck },
    { id: 'tarix', label: 'Tarix', icon: History },
    { id: 'hisobot', label: 'Hisobotlar', icon: FileText },
    { id: 'statistika', label: 'Risklar', icon: BarChart3 },
    { id: 'profil', label: 'Profil', icon: UserRound }
  ];

  return (
    <div className="min-h-screen grid-bg text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <aside className="glass hidden w-64 shrink-0 rounded-lg p-4 lg:block">
          <button onClick={() => onNavigate('bosh')} className="mb-8 flex w-full items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 shadow-neon">
              <ShieldCheck className="h-6 w-6 text-cyan-200" />
            </span>
            <span>
              <span className="block text-lg font-semibold">Kiber Himoya</span>
              <span className="text-xs text-cyan-100/70">AI xavfsizlik markazi</span>
            </span>
          </button>
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                    active === item.id ? 'bg-cyan-300/14 text-cyan-100 shadow-neon' : 'text-slate-300 hover:bg-white/7'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-8 rounded-lg border border-cyan-300/20 bg-cyan-300/8 p-4">
            <div className="flex items-center gap-2 text-sm text-cyan-100">
              <Activity className="h-4 w-4" />
              Jonli kuzatuv
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-300">Auditlar, fishing tahlillari va maslahatlar yagona panelda saqlanadi.</p>
          </div>
          <div className="mt-4 rounded-lg border border-cyan-300/20 bg-black/20 p-4">
            <button type="button" onClick={() => onNavigate('profil')} className="w-full text-left">
              <p className="text-sm font-semibold text-white">{user?.ism}</p>
              <p className="mt-1 truncate text-xs text-slate-400">{user?.email}</p>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-100 transition hover:bg-rose-400/15"
            >
              <LogOut className="h-4 w-4" />
              Chiqish
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-hidden pb-24 lg:pb-0">
          <button
            type="button"
            onClick={onBack}
            disabled={!canBack}
            aria-label="Orqaga qaytish"
            title="Orqaga qaytish"
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 transition hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            {children}
          </motion.div>
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-cyan-200/14 bg-slate-950/92 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] ${
                  active === item.id ? 'bg-cyan-300/14 text-cyan-100' : 'text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
