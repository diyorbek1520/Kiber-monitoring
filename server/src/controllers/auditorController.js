// Analysis modeli audit natijalarini bazaga saqlash uchun ishlatiladi.
import { Analysis } from '../models/Analysis.js';

// runAudit kiberxavfsizlik tekshiruvlarini bajarish uchun ishlatiladi.
import { runAudit } from '../services/auditorService.js';

export async function auditTarget(req, res) {
  const natija = await runAudit(req.body.manzil);
  const saved = await Analysis.create({
    userId: req.user._id,
    turi: 'auditor',
    kirish: { manzil: req.body.manzil },
    natija,
    ball: natija.ball,
    xavfDarajasi: natija.baho
  });

  res.json({ id: saved._id, natija });
}
