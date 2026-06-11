// Analysis modeli maslahatchi savol-javoblarini tarixga saqlash uchun ishlatiladi.
import { Analysis } from '../models/Analysis.js';

// askConsultant foydalanuvchi savoliga AI maslahatchi javobini olish uchun ishlatiladi.
import { askConsultant } from '../services/consultantService.js';

export async function consult(req, res) {
  const natija = await askConsultant({ question: req.body.savol, history: req.body.tarix || [] });
  await Analysis.create({
    userId: req.user._id,
    turi: 'maslahatchi',
    kirish: { savol: req.body.savol },
    natija
  });

  res.json(natija);
}
