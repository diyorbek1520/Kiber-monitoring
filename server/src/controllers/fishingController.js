// Analysis modeli phishing tahlil natijalarini bazaga saqlash uchun ishlatiladi.
import { Analysis } from '../models/Analysis.js';

// runFishingAnalysis phishing xavfini tekshirish va AI tahlil olish uchun ishlatiladi.
import { runFishingAnalysis } from '../services/fishingService.js';

export async function analyzeFishing(req, res) {
  const natija = await runFishingAnalysis(req.body.matn);
  const saved = await Analysis.create({
    userId: req.user._id,
    turi: 'fishing',
    kirish: { matn: req.body.matn },
    natija,
    ball: natija.ehtimol,
    xavfDarajasi: natija.ehtimol >= 80 ? 'Juda xavfli' : natija.ehtimol >= 50 ? 'Xavfli' : 'Past'
  });

  res.json({ id: saved._id, natija });
}
