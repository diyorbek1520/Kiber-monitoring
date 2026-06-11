// Framer Motion yuklanish holatiga yengil animatsiya berish uchun ishlatiladi.
import { motion } from 'framer-motion';

// Lucide React yuklanish ikonini ko'rsatish uchun ishlatiladi.
import { LoaderCircle } from 'lucide-react';

export function LoadingPanel({ text = 'Tahlil bajarilmoqda' }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-lg p-5">
      <div className="flex items-center gap-3 text-cyan-100">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <span>{text}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-cyan-300"
          initial={{ x: '-100%' }}
          animate={{ x: '120%' }}
          transition={{ repeat: Infinity, duration: 1.25, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
