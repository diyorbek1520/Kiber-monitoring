// Lucide React ikonlari yuqori paneldagi menyu va xavfsizlik belgilari uchun ishlatiladi.
import { Menu, ShieldAlert } from 'lucide-react';

export function TopBar({ title, subtitle }) {
  return (
    <div className="mb-5 flex flex-col gap-4 rounded-lg border border-cyan-200/14 bg-white/5 p-5 shadow-glass backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="flex items-center gap-2 text-sm text-cyan-200">
          <ShieldAlert className="h-4 w-4" />
          Professional kiberxavfsizlik boshqaruvi
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{subtitle}</p>
      </div>
      <button className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
    </div>
  );
}
