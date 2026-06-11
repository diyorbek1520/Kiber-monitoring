// Lucide React kabinet sahifasidagi tashkilot, kalit va xavfsizlik ikonlari uchun ishlatiladi.
import { Building2, KeyRound, ShieldCheck } from 'lucide-react';

// TopBar sahifa sarlavhasi va yuqori panelni ko'rsatish uchun ishlatiladi.
import { TopBar } from '../components/TopBar.jsx';

export function CabinetPage() {
  return (
    <>
      <TopBar title="Foydalanuvchi kabineti" subtitle="Tashkilot xavfsizlik holati, AI ulanishi va platforma sozlamalarini ko‘rish uchun boshqaruv oynasi." />
      <section className="grid gap-5 lg:grid-cols-3">
        <Card icon={Building2} title="Tashkilot" text="Kichik biznes yoki startap profili uchun xavfsizlik jarayonlarini markazlashtiring." />
        <Card icon={KeyRound} title="AI ulanishi" text="OpenAI API kaliti serverdagi .env fayli orqali ulanadi va brauzerga chiqarilmaydi." />
        <Card icon={ShieldCheck} title="Himoya holati" text="Auditlar tarixi va risk statistikasi asosida umumiy xavfsizlik nazorati yuritiladi." />
      </section>
    </>
  );
}

function Card({ icon: Icon, title, text }) {
  return (
    <article className="glass rounded-lg p-5">
      <Icon className="h-8 w-8 text-cyan-100" />
      <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
    </article>
  );
}
